
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
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollArea } from "@/components/ui/scroll-area"

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

    return (
        <Card className={cn("w-[380px]", className)} {...props}>
            {reports ? <>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have {reports.length} unread reports.</CardDescription>
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
                    <ScrollArea className="w-full h-full max-h-[300px]">
                        {reports.map(notification => (
                            <div
                                key={notification._id}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(notification._creationTime, 'PPPppp')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
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
