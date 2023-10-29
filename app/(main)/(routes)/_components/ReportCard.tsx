import { Doc } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from '@mantine/hooks';
import { number } from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import UserReport from './UserReport';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';


interface ReportCardProps {
    notification: Doc<'reports'>
}

const ReportCard = ({ notification }: ReportCardProps) => {

    const change = useMutation(api.documents.updateReport)
    const reportRef = useRef<HTMLDivElement>(null)

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const [interactingTime, setInteractingTime] = useState<number>(0)

    const { ref, entry } = useIntersection({
        root: reportRef.current,
        threshold: 1
    })

    const deleteReport = useMutation(api.documents.deleteReport)

    // useEffect(() => {
    //     // if (entry?.time === undefined) setInteractingTime(0)
    //     // console.log(entry?.time)
    //     // setInteractingTime(entry?.time)
    //     // console.log(interactingTime)
    //     // if (entry.time > 5000 && entry.isIntersecting) 
    //     // if (entry?.isIntersecting && entry?.time > 10000) change({ isRead: true, id: notification._id })

    // }, [entry])

    const onRead = () => {
        setTimeout(() => {
            change({
                id: notification._id,
                isRead: true
            })
        }, 500);
    }

    const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        try {
            setIsDeleting(true)
            await deleteReport({
                id: notification._id
            })
            toast.success(`deleted`)
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsDeleting(false)
        }
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    onClick={onRead}
                    ref={ref}
                    key={notification._id}
                    className="mb-4 grid relative grid-cols-[25px_1fr] group items-start pb-4 last:mb-0 last:pb-2  p-3 group hover:bg-gray-900 transition rounded-lg cursor-pointer"
                >
                    <span className={cn(`flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 opacity-100 transition duration-300`, notification.isRead && 'opacity-0')} />
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {format(notification._creationTime, 'PPPpp')}
                        </p>
                    </div>
                    <Button disabled={isDeleting} onClick={onDelete} size={'icon'} variant={'outline'} className='absolute group-hover:opacity-100 top-2 right-2 opacity-0 transition'>{isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash className='w-4 h-4' />}</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent align='start' side='left'>
                <UserReport report={notification} />
            </PopoverContent>
        </Popover>
    )
}

export default ReportCard