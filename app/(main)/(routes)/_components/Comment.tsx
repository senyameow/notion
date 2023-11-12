'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import React, { useRef, useState } from 'react'

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
import { Check, Edit, Loader2, MoreHorizontal, Send, Smile, Trash } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/ActionTooltip';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CommentReply from './CommentReply';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { editReplySlice } from '@/store/reducers/EditReplySlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteCommentModalSlice } from '@/store/reducers/DeleteCommentModalSlice';
import DeleteCommentModal from '@/components/modals/DeleteCommentModal';
import { EmojiPicker } from '@/components/EmojiPicker';
import IconReplyButton from './IconReplyButton';
import IconCommentButton from './IconCommentButton';

interface CommentProps {
    comment: Doc<'comments'>;
    preview?: boolean;
    doc: Doc<'documents'>
}

const Comment = ({ comment, preview, doc }: CommentProps) => {

    const commentCreater = useQuery(api.documents.getUser, { id: comment.userId })

    const dispatch = useAppDispatch()

    const { onOpen } = deleteCommentModalSlice.actions

    const { user, isLoaded } = useUser()
    const userRole = doc.people?.find(human => human.id === user?.id)?.role!
    preview = userRole !== 'ADMIN' && userRole !== 'MOD' && preview

    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState('')

    // console.log(message)


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

    const resolveComment = useMutation(api.documents.resolveComment).withOptimisticUpdate(
        (localStorage, args) => {
            const { id } = args
            const existingComments = localStorage.getQuery(api.documents.getComments, { docId: comment.docId })
            if (existingComments !== undefined) {
                const currentComment = existingComments.find(comment => comment._id === id)
                if (currentComment !== undefined) {
                    localStorage.setQuery(api.documents.getComments, { docId: comment.docId }, [
                        ...existingComments.map(com => {
                            if (com._id === id) return { ...com, isResolved: true }
                            return com
                        }),
                    ])
                }
            }
        }
    )

    const addCommentIcon = useMutation(api.documents.addCommentEmoji)

    const onSave = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isLoaded) {
            if (e.key === 'Enter') {
                setIsEditing(false)
                await createReply({
                    content: message,
                    commentId: comment._id,
                    userId: user?.id!,
                })
                setMessage('')
            }
        }
    }

    const onReply = async (e: any) => {
        console.log(message, 'MESSAGE')
        if (e.keyCode === 13) {
            setIsEditing(false)
        }
        console.log(message)
        if (isLoaded) {
            if (message === '') return
            if (message !== '') {
                await createReply({
                    content: message,
                    commentId: comment._id,
                    userId: user?.id!
                })

                setMessage('')
            }
        }
    }

    const enableInput = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0);
    }
    const inputRef = useRef<HTMLInputElement>(null)

    const onResolve = async () => {
        toast.success('comment resolved')
        resolveComment({
            id: comment._id
        })
    }

    const onIconChange = async (icon: string) => {
        try {
            await addCommentIcon({
                icon,
                commentId: comment._id
            })
            toast.success('added')
        } catch (error) {
            toast.error('something went wrong')
        }
    }

    return (
        <>
            {commentCreater === undefined ? <Comment.Skeleton /> : <Card className="w-full group min-h-[150px] mb-2">
                <DeleteCommentModal />
                <CardHeader className='pb-2 w-full'>
                    <CardTitle className='pb-2 flex items-center justify-between w-full '>
                        <div className='w-full flex items-center gap-3'>
                            <ActionTooltip label={commentCreater.email!} side='top' align='center'><Image src={commentCreater.image_url} alt='avatar' className='rounded-full' width={30} height={30} /></ActionTooltip>
                            <span className='text-lg font-semibold'>{commentCreater.name}</span>
                            <span className='text-xs text-gray-300'>{format(comment._creationTime, 'Ppaaa')}</span>
                        </div >
                        <div className='flex opacity-0 items-center w-full h-full flex-1 gap-[1.5px] group-hover:opacity-100 transition bg-gray-800 rounded-md p-1'>
                            <EmojiPicker onChange={onIconChange}><ActionTooltip label='add reaction' side='top' align='center'><button onClick={() => { }} className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><Smile className='w-4 h-4' /></button></ActionTooltip></EmojiPicker>
                            <ActionTooltip label='resolve' side='top' align='center'>
                                <button onClick={onResolve} className={cn(`hover:bg-gray-500 p-[1.5px] transition rounded-md`, preview && 'hidden')}><Check className='w-4 h-4' /></button>
                            </ActionTooltip>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <ActionTooltip label='more' side='top' align='center'><button onClick={() => { }} className={cn(`hover:bg-gray-500 p-[1.5px] transition rounded-md`, preview && 'hidden')}><MoreHorizontal className='w-4 h-4' /></button></ActionTooltip>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48 z-[99999] relative">
                                    <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                        <DropdownMenuItem onSelect={() => dispatch(onOpen({ commentId: comment._id }))} className='cursor-pointer w-full flex items-center gap-2'>
                                            <Trash className='w-4 h-4' />
                                            Delete comment
                                        </DropdownMenuItem>

                                    </DropdownMenuGroup>
                                </DropdownMenuContent>

                            </DropdownMenu>
                        </div>
                    </CardTitle >
                    {comment.commentLine && <CardDescription className='break-words max-h-[60px]'>
                        <div className='flex w-full items-center gap-2 break-words '>
                            <div className='max-w-[350px] leading-5 border-l-4 border-l-yellow-400 pl-2 max-h-[60px] text-ellipsis overflow-hidden'>
                                {comment.commentLine}
                            </div>
                        </div>
                    </CardDescription>}
                </CardHeader >
                <CardContent className='py-0'>
                    <div>
                        {comment.content}
                    </div>
                    {comment.icons!.length > 0 && <div className='flex items-center gap-2 flex-wrap'>
                        {comment.icons!.map(icon => (
                            <IconCommentButton userId={user?.id!} icons={comment.icons!} key={icon.icon} icon={icon!} commentId={comment._id} />
                        ))}
                    </div>}
                </CardContent>

                {comment.replies?.map(reply => (
                    <CommentReply {...reply} replyId={reply.id} commentId={comment._id} preview={preview} key={reply.created_at} icons={reply.icons!} />
                ))}

                {isLoaded ? <CardFooter className="flex gap-4 group h-full w-full items-center">
                    <ActionTooltip label={user?.emailAddresses[0].emailAddress!} side='top' align='center'><Image src={user?.imageUrl!} alt='user avatar' className='rounded-full' width={30} height={30} /></ActionTooltip>
                    <div className='relative w-full h-full'>
                        {isEditing ? <Input placeholder='reply...' onMouseOver={enableInput} ref={inputRef} onKeyDown={onSave} className='h-8 relative w-[95%] bg-transparent py-0 border-none focus-visible:border-none focus-visible:border-0 focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' onChange={e => setMessage(e.target.value)} value={message} /> : <Button variant={'ghost'} onClick={enableInput} className='w-full flex justify-start duration-300 px-2 py-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition rounded-xl'>
                            <div className=''>
                                Reply...
                            </div>

                        </Button>}
                        <Send role='button' onClick={e => onReply(e)} className={cn(`w-4 h-4 text-blue-400 absolute top-[8px] -right-0 cursor-pointer opacity-0 transition`, isEditing && 'opacity-100')} />
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