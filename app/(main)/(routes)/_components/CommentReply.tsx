import React, { useRef, useState } from 'react'

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
import { Doc, Id } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Edit, MoreHorizontal, Smile, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/redux'
import { editReplySlice } from '@/store/reducers/EditReplySlice'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from '@/components/EmojiPicker'
import IconReplyButton from './IconReplyButton'

interface CommentReplyProps {
    icons: { icon?: string | undefined; amount?: number | undefined }[]
    userId: string;
    content: string;
    created_at: number;
    preview?: boolean;
    replyId: string;
    commentId: Id<'comments'>;
}

const CommentReply = ({ icons, userId, content, created_at, preview, replyId, commentId }: CommentReplyProps) => {

    const deleteReply = useMutation(api.documents.deleteCommentReply)

    const [isEditing, setIsEditing] = useState(false)

    const [message, setMessage] = useState(content)

    const user = useQuery(api.documents.getUser, { id: userId })

    const updateReply = useMutation(api.documents.updateCommentReply)


    const onDeleteReply = async () => {
        try {
            await deleteReply({
                commentId,
                replyId
            })
            toast.success('deleted')
        } catch (error) {
            toast.error('something went wrong')
        }
    }

    const onSave = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isEditing) {
            if (e.key === 'Enter') {
                setIsEditing(false)
                try {
                    await updateReply({
                        content: message,
                        commentId,
                        replyId
                    })
                    toast.success('editted')
                } catch (error) {
                    toast.error('something went wrong')
                } finally {
                    setMessage('')
                }

            }
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)

    const onEdit = () => {
        setTimeout(() => {
            setIsEditing(true)
        }, 0);
    }

    const updateCommentReply = useMutation(api.documents.addIconCommentReply)

    const onIconChange = async (icon: string) => {
        try {
            await updateCommentReply({
                commentId,
                replyId,
                icon
            })
            toast.success('!!')
        } catch (error) {
            toast.error('something went wrong')
        }
    }

    console.log(icons)


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
                        <EmojiPicker onChange={onIconChange}><ActionTooltip label='add reaction' side='top' align='center'><button onClick={() => { }} className='hover:bg-gray-500 p-[1.5px] transition rounded-md'><Smile className='w-4 h-4' /></button></ActionTooltip></EmojiPicker>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal role='button' className={cn(`hover:bg-gray-500 p-[1.5px] transition rounded-md`, preview && 'hidden')} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48 z-[99999] relative">
                                <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                    <DropdownMenuItem onSelect={onEdit} className='cursor-pointer w-full flex items-center gap-2'>
                                        <Edit className='w-4 h-4' />
                                        Edit reply
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={onDeleteReply} className='cursor-pointer w-full flex items-center gap-2'>
                                        <Trash className='w-4 h-4' />
                                        Delete reply
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>

                        </DropdownMenu>
                    </div>
                </CardTitle >
            </CardHeader >

            {isEditing ? (
                <Input placeholder='reply...' ref={inputRef} onKeyDown={onSave} className='h-8 relative w-[90%] mx-auto px-2 mb-2 py-3 bg-transparent border-none focus-visible:border-none focus-visible:border-0 focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' onChange={e => setMessage(e.target.value)} value={message} />
            ) : <CardContent className=''>
                <span>{content}</span>
                {icons.length > 0 && <div className='flex items-center gap-2 flex-wrap'>
                    {icons.map(icon => (
                        <IconReplyButton icons={icons!} key={icon.icon} icon={icon!} replyId={replyId} commentId={commentId} />
                    ))}
                </div>}
            </CardContent>}


        </div >
    )
}

export default CommentReply