import { Doc } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from '@mantine/hooks';
import { number } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';


interface ReportCardProps {
    notification: Doc<'reports'>
}

const ReportCard = ({ notification }: ReportCardProps) => {

    const change = useMutation(api.documents.updateReport)
    const reportRef = useRef<HTMLDivElement>(null)

    const [interactingTime, setInteractingTime] = useState<number>(0)



    const { ref, entry } = useIntersection({
        root: reportRef.current,
        threshold: 1
    })



    // useEffect(() => {
    //     // if (entry?.time === undefined) setInteractingTime(0)
    //     // console.log(entry?.time)
    //     // setInteractingTime(entry?.time)
    //     // console.log(interactingTime)
    //     // if (entry.time > 5000 && entry.isIntersecting) 
    //     // if (entry?.isIntersecting && entry?.time > 10000) change({ isRead: true, id: notification._id })

    // }, [entry])


    return (
        <div
            ref={ref}
            key={notification._id}
            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
        >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                    {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                    {format(notification._creationTime, 'PPPpp')}
                </p>
            </div>
        </div>
    )
}

export default ReportCard