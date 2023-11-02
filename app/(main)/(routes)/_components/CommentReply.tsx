import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { ActionTooltip } from '@/components/ui/ActionTooltip'
import { Doc } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreHorizontal, Smile } from 'lucide-react'

interface CommentReplyProps {
    icons?: string[] | undefined;
    userId: string;
    content: string;
    created_at: number;
}

const CommentReply = ({ icons, userId, content, created_at }: CommentReplyProps) => {

    const user = useQuery(api.documents.getUser, { id: userId })

    return (
        <div className='group/reply'>
            <CardHeader className='w-full'>
                <CardTitle className=' flex items-center justify-between w-full '>
                    {user === undefined ? (
                        <div className='w-full flex items-center gap-3'>
                            <Skeleton className='w-[30px] h-[30px] rounded-full' />
                        </div>
                    ) : <div className='w-full flex items-center gap-3'>
                        <ActionTooltip label={user.email!} side='top' align='center'><Image src={user.image_url} alt='avatar' className='rounded-full' width={30} height={30} /></ActionTooltip>
                        <span className='text-lg font-semibold'>{user.name}</span>
                        <span className='text-xs text-gray-300'>{format(created_at, 'Ppaaa')}</span>
                    </div >}
                    <div className='flex opacity-0 items-center w-full h-full flex-1 gap-[2.5px] group-hover/reply:opacity-100 transition bg-gray-800 rounded-md p-1'>
                        <ActionTooltip label='add reaction' side='top' align='center'><button className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><Smile className='w-4 h-4' /></button></ActionTooltip>
                        <ActionTooltip label='more' side='top' align='center'><button className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><MoreHorizontal className='w-4 h-4' /></button></ActionTooltip>
                    </div>
                </CardTitle >
            </CardHeader >
            <CardContent className=''>
                {content}
            </CardContent>
        </div>
    )
}

export default CommentReply