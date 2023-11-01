'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format } from 'date-fns';
import { Check, MoreHorizontal, Smile } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/ActionTooltip';
import { useUser } from '@clerk/clerk-react';

interface CommentProps {
    comment: Doc<'comments'>
}

const Comment = ({ comment }: CommentProps) => {

    const commentCreater = useQuery(api.documents.getUser, { id: comment.userId })

    const { user, isLoaded } = useUser()

    return (
        <>
            {commentCreater === undefined ? <Comment.Skeleton /> : <Card className="w-full group min-h-[150px]">
                <CardHeader className='pb-2 w-full'>
                    <CardTitle className='pb-2 flex items-center justify-between w-full '>
                        <div className='w-full flex items-center gap-3'>
                            <Image src={commentCreater.image_url} alt='avatar' className='rounded-full' width={30} height={30} />
                            <span className='text-lg font-semibold'>{commentCreater.name}</span>
                            <span className='text-xs text-gray-300'>{format(comment._creationTime, 'Ppaaa')}</span>
                        </div >
                        <div className='flex opacity-0 items-center w-full h-full flex-1 gap-[1.5px] group-hover:opacity-100 transition bg-gray-800 rounded-md p-1'>
                            <ActionTooltip label='add reaction' side='top' align='center'><button className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><Smile className='w-4 h-4' /></button></ActionTooltip>
                            <ActionTooltip label='resolve' side='top' align='center'><button className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><Check className='w-4 h-4' /></button></ActionTooltip>
                            <ActionTooltip label='more' side='top' align='center'><button className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><MoreHorizontal className='w-4 h-4' /></button></ActionTooltip>
                        </div>
                    </CardTitle >
                    <CardDescription className=''>
                        <div className='flex w-full h-full items-center gap-2 break-words '>
                            <div className='max-w-[300px] leading-5 border-l-4 border-l-yellow-400 pl-2'>
                                {comment.commentLine}
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader >
                <CardContent className=''>
                    {comment.content}
                </CardContent>
                {isLoaded ? <CardFooter className="flex gap-4 group h-full w-full items-center">
                    <Image src={user?.imageUrl!} alt='user avatar' className='rounded-full' width={30} height={30} />
                    <div className='flex-1 w-full px-[6px] py-2 transition text-gray-500 font-semibold hover:bg-gray-800 cursor-pointer rounded-lg'>
                        Reply...
                    </div>
                </CardFooter> : (
                    <div className='flex gap-2 h-full w-full items-center'>
                        <Skeleton className='w-[30px] h-[30px] rounded-full' />
                        <Skeleton className='flex-1 h-6 rounded-md bg-white' />
                    </div>
                )}
            </Card >}
        </>
    )
}

Comment.Skeleton = function ItemSkeleton() {
    return (
        <div className='flex gap-2 items-center'>
            <Skeleton className='h-[30px] w-[30px] rounded-full bg-gray-400 opacity-80' />
            <div className='flex flex-col gap-2 items-start'>
                <Skeleton className='h-2 w-[200px] rounded-md  bg-gray-400 opacity-80' />
                <Skeleton className='h-2 w-[140px] rounded-md  bg-gray-400 opacity-80' />
                <Skeleton className='h-2 w-[170px] rounded-md  bg-gray-400 opacity-80' />
                <Skeleton className='h-2 w-[165px] rounded-md  bg-gray-400 opacity-80' />
                <Skeleton className='h-2 w-[180px] rounded-md  bg-gray-400 opacity-80' />
            </div>
        </div>
    )
}

export default Comment