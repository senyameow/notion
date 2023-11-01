'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { MessageCircle, MessagesSquare } from "lucide-react"
import UserCard from "./UserCard"
import { format } from "date-fns"
import Comment from "./Comment"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"

interface CommentSheetProps {
    doc: Doc<'documents'>
}

const CommentSheet = ({ doc }: CommentSheetProps) => {

    const comments = useQuery(api.documents.getComments, { docId: doc._id })

    const { user, isLoaded } = useUser()

    return (
        <Sheet>
            <SheetTrigger className="flex items-center w-full h-full px-2 py-1 hover:opacity-90 transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground hover:text-accent-foreground rounded-md">
                <MessageCircle className='w-4 h-4 mr-2 ' />
                Comments
            </SheetTrigger>
            <SheetContent className="z-[99999] min-w-[500px] h-full flex-1">
                <SheetHeader>
                    <SheetTitle>{doc.title}</SheetTitle>
                    <SheetDescription>
                        You can change behavior in settings
                    </SheetDescription>
                </SheetHeader>
                <div className="flex items-start gap-5 flex-col py-8 h-full w-full">
                    <Label>Comments: </Label>
                    {comments?.length === 0 && (
                        <div className="w-full h-full gap-2 flex flex-col items-center justify-center text-sm text-center">
                            <MessagesSquare className="w-12 h-12" />
                            <span className="text-gray-400">No open comments yet</span>
                            <span className="max-w-[200px]">Open comments on this page will appear here</span>
                        </div>
                    )}
                    {comments === undefined ? (
                        <div className="w-full h-full flex-col flex gap-5">
                            <Comment.Skeleton />
                            <Comment.Skeleton />
                            <Comment.Skeleton />
                            <Comment.Skeleton />
                            <Comment.Skeleton />
                        </div>
                    ) : <ScrollArea className={cn(`h-full w-full`, comments.length === 0 && 'hidden')}>
                        {comments?.map(comment => (
                            <Comment key={comment._id} comment={comment} />
                        ))}
                    </ScrollArea>}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CommentSheet