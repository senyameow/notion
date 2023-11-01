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

interface CommentProps {
    comment: Doc<'comments'>
}

const Comment = ({ comment }: CommentProps) => {

    const commentCreater = useQuery(api.documents.getUser, { id: comment.userId })

    return (
        <>
            {commentCreater === undefined ? <Comment.Skeleton /> : <Card className="w-[300px] min-h-[150px]">
                <CardHeader>
                    <CardTitle>
                        <div className='w-full flex items-center gap-3'>
                            <Image src={commentCreater.image_url} alt='avatar' className='rounded-full' width={30} height={30} />
                            <span className='text-lg font-semibold'>{commentCreater.name}</span>
                        </div >
                    </CardTitle >
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader >
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of your project" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Close</Button>
                </CardFooter>
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