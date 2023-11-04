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
import { Bell, Check, Loader2 } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { format } from "date-fns"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReportCard from "./ReportCard"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { report } from "@/convex/documents"

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

    const updateRep = useMutation(api.documents.updateReport)

    const notifications = useQuery(api.documents.getNotifications)

    if (reports === undefined) {
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
    const notDeleted = reports?.filter(rep => !rep.isDeleted)

    const onReadAll = async () => {
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

    return (
        <Card className={cn("w-[380px]", className)} {...props}>
            {reports ? <>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have {newReports.length} unread reports.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <Bell />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Push Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Send notifications to device.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    {notifications.reports === true && <ScrollArea className="w-full h-full max-h-[300px]">
                        {notDeleted.map(notification => (
                            <ReportCard notification={notification} key={notification._id} />
                        ))}
                    </ScrollArea>}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={onReadAll}>
                        <Check className="mr-2 h-4 w-4" /> Mark all as read
                    </Button>
                </CardFooter>
            </> : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            )}
        </Card>
    )
}
