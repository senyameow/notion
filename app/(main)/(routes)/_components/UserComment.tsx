'use client'
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react';
import { Loader2, Send } from 'lucide-react';
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';

interface UserCommentProps {
    comment: Doc<'comments'>
}

const UserComment = ({ comment }: UserCommentProps) => {

    const user = useQuery(api.documents.getUser, { id: comment.userId })

    const inputRef = useRef<HTMLInputElement>(null)
    const createReply = useMutation(api.documents.createCommentReply).withOptimisticUpdate(
        (localStorage, { content, userId, commentId }) => {
            if (content === '') return
            const existingComments = localStorage.getQuery(api.documents.getComments, { docId: comment.docId })
            if (existingComments !== undefined) {
                const currentComment = existingComments.find(comment => comment._id === commentId)
                if (currentComment !== undefined) {
                    const existingReplies = currentComment.replies
                    if (existingReplies !== undefined) {
                        const newReply = {
                            userId,
                            content,
                            created_at: Date.now(),
                            id: crypto.randomUUID(),
                            icons: []
                        }
                        localStorage.setQuery(api.documents.getComments, { docId: comment.docId }, [
                            ...existingComments.map(com => {
                                if (com._id === currentComment._id) return {
                                    ...com, replies: [...com.replies!, newReply]
                                }
                                return com
                            })
                        ]
                        )
                    }
                }
            }
        }
    )
    const [message, setMessage] = useState('')
    const onCreate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (user !== undefined)
            if (e.key === 'Enter') {
                if (message === '') return
                createReply({
                    content: message,
                    commentId: comment._id,
                    userId: user.userId
                })
                setMessage('')

            }
    }

    const onSend = async () => {
        if (user !== undefined) {
            if (message === '') return
            createReply({
                content: message,
                commentId: comment._id,
                userId: user.userId
            })
            setMessage('')
        }
    }

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
            <h2 className='text-xl font-bold border-yellow-500 border-l-2 pl-2 truncate max-w-full'>{comment.commentLine}</h2>
            <ScrollArea className='min-h-full h-full text-sm'>
                {comment.content}
            </ScrollArea>
            <div className='w-full relative'>
                <Input placeholder='reply...' ref={inputRef} onKeyDown={onCreate} className='h-8 relative w-[90%] mr-auto px-2 mb-2 py-3 bg-transparent border-none focus-visible:border-none focus-visible:border-0 focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' onChange={e => setMessage(e.target.value)} value={message} />
                <Send role='button' onClick={onSend} className='absolute top-2 w-5 h-5 text-sky-500 right-0 ' />
            </div>
        </div>
    )
}

export default UserComment