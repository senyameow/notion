'use client'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

interface UserReportProps {
    report: Doc<'reports'>
}

const UserReport = ({ report }: UserReportProps) => {

    const user = useQuery(api.documents.getUser, { id: report.userId })

    return (
        <div className='flex flex-col items-start gap-3 w-full h-full'>
            {user === undefined ? (
                <div className='flex w-full items-center gap-3'>
                    <Skeleton className='w-[25px] h-[25px] rounded-full bg-gray-700' />
                    <Skeleton className='w-[200px] h-[20px] bg-gray-700' />
                </div>
            ) : (
                <div className='flex w-full items-center gap-3'>
                    <Image src={user.image_url} alt='user avatar' className='rounded-full' width={30} height={30} />
                    <span className='text-lg font-semibold'>{user.name}</span>
                </div>
            )}
            <h2 className='text-xl font-bold'>{report.title}</h2>
            <ScrollArea className='min-h-full h-full text-sm'>
                {report.content}
            </ScrollArea>
        </div>
    )
}

export default UserReport