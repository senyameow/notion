'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Check, Loader2, Trash2 } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { format } from "date-fns"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReportCard from "./ReportCard"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { report, updateCommentNotification } from "@/convex/documents"
import { useUser } from "@clerk/clerk-react"
import CommentCard from "./CommentCard"

import { Tab } from '@headlessui/react'
import { Popover, PopoverTrigger } from "@/components/ui/popover"

// const notifications = [
//     {
//         title: "Your call has been confirmed.",
//         description: "1 hour ago",
//     },
//     {
//         title: "You have a new message!",
//         description: "1 hour ago",
//     },
//     {
//         title: "Your subscription is expiring soon!",
//         description: "2 hours ago",
//     },
// ]

type CardProps = React.ComponentProps<typeof Card> & {
    doc: Doc<'documents'>;
}

export function Notifications({ doc, className, ...props }: CardProps) {

    const reports = useQuery(api.documents.reports, { docId: doc._id })
    const comments = useQuery(api.documents.comments, { docId: doc._id })

    const updateRep = useMutation(api.documents.updateReport)
    const updateCommentNotification = useMutation(api.documents.updateCommentNotification)

    const user = useQuery(api.documents.getUser, { id: doc.userId })

    if (reports === undefined || comments === undefined || user === undefined) {
        return (
            <div className="w-[380px] h-[300px] flex flex-col items-start gap-4 p-6">
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
                <Skeleton className="w-[230px] bg-slate-900 h-[30px]" />
            </div>
        )
    }


    const newReports = reports?.filter(rep => !rep.isRead)
    const notDeletedReports = reports?.filter(rep => !rep.isDeleted)
    const newComments = comments?.filter(com => !com.isRead && !com.isResolved)
    const notDeletedComments = comments?.filter(comment => !comment.isDeleted)

    const onReadAllReports = async () => {
        try {
            reports.forEach(async (rep) => {
                await updateRep({
                    id: rep._id,
                    isRead: true
                })
                toast.success(`you have marked as read ${rep.title}`)
            })
        } catch (error) {
            toast.error('something went wrong')
        }
    }
    const onReadAllComments = async () => {
        try {
            comments.forEach(async (comment) => {
                await updateCommentNotification({
                    commentId: comment._id,
                    isRead: true
                })
            })
        } catch (error) {
            toast.error('something went wrong')
        }
    }

    return (
        <Card className={cn("w-[400px]", className)} {...props}>
            {reports ? <>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between w-full gap-2 mb-1">
                        <span>Notifications</span>
                        <Popover>
                            <PopoverTrigger>
                                <Trash2 className="w-5 h-5 hover:opacity-90" />
                            </PopoverTrigger>
                        </Popover>
                    </CardTitle>
                    <CardDescription>You have {newComments.length} unread comments and {newReports.length} unread reports </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <Bell />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Push Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Send notifications to device.
                            </p>
                        </div>
                        <Switch onCheckedChange={() => { }} />
                    </div> */}
                    <Tab.Group>
                        <Tab.List className={'flex space-x-1 rounded-xl bg-blue-900/20 p-1'}>
                            {Object.keys(user.notifications!).map(notification => (
                                <Tab key={notification} className={({ selected }) =>
                                    cn(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 mr-2 text-blue-700',
                                        ' focus:outline-none',
                                        selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    )
                                }>{notification}</Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className={'mt-2'}>
                            {notDeletedComments.length > 0 && < Tab.Panel className={cn(
                                'rounded-xl',
                                ' focus:outline-none'
                            )}>

                                {user.notifications?.comments && <ScrollArea className="w-full h-full max-h-[300px]">
                                    {notDeletedComments.map(comment => (
                                        <CommentCard comment={comment} key={comment._id} />
                                    ))}
                                </ScrollArea>}
                                <Button disabled={newComments.filter(c => c.isRead || !c.isDeleted).length === 0} className="w-full mt-6" onClick={onReadAllComments}>
                                    <Check className="mr-2 h-4 w-4" /> Mark all as read
                                </Button>

                            </Tab.Panel>}
                            {notDeletedReports.length > 0 && < Tab.Panel className={cn(
                                'rounded-xl',
                                ' focus:outline-none'
                            )}>
                                {user.notifications?.reports && <ScrollArea className="w-full h-full max-h-[300px]">
                                    {notDeletedReports.map(notification => (
                                        <ReportCard notification={notification} key={notification._id} />
                                    ))}
                                </ScrollArea>}
                                <Button disabled={notDeletedReports.length !== 0} className="w-full mt-6" onClick={onReadAllReports}>
                                    <Check className="mr-2 h-4 w-4" /> Mark all as read
                                </Button>

                            </Tab.Panel>}
                        </Tab.Panels>


                    </Tab.Group>
                </CardContent>
                {/* <CardFooter>

                </CardFooter> */}
            </> : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            )
            }
        </Card >
    )
}
