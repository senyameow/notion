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
import { MessageCircle } from "lucide-react"
import UserCard from "./UserCard"
import { format } from "date-fns"

interface InfoSheetProps {
    doc: Doc<'documents'>
}

export function InfoSheet({ doc }: InfoSheetProps) {

    const people = useQuery(api.documents.getAllPeople, { ids: doc.visitedPeople })?.filter(visiter => visiter.userId !== doc.userId)

    const creator = useQuery(api.documents.getUser, { id: doc.userId })

    return (
        <Sheet>
            <SheetTrigger className="flex items-center w-full px-2">
                <MessageCircle className='w-4 h-4 mr-2' />
                Info
            </SheetTrigger>
            <SheetContent className="z-[99999]">
                <SheetHeader>
                    <SheetTitle>{doc.title}</SheetTitle>
                    <SheetDescription>
                        You can track info of your note
                    </SheetDescription>
                </SheetHeader>
                <div className="flex items-start gap-5 flex-col py-8">
                    <Label>People visited your page:</Label>
                    <div className="flex flex-col gap-2 w-full">
                        <Label className="py-3">Created: </Label>
                        <div className="flex flex-row items-center gap-5">
                            <Label className="text-neutral-500 text-xs">at: </Label>
                            <h3>{format(doc._creationTime, 'dd MMMM yyyy')}</h3>

                        </div>
                        <div className="flex flex-row items-center gap-5 w-full">
                            <Label className="text-neutral-500 text-xs">by: </Label>
                            <UserCard user={creator!} preview />
                        </div>
                    </div>
                    <ScrollArea className="h-[300px] w-full">
                        <div className="flex flex-col gap-2">
                            {people?.map(user => (
                                <UserCard key={user._id} user={user} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
