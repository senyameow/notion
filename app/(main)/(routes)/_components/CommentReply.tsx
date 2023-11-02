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
import { Doc, Id } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Edit, MoreHorizontal, Smile, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface CommentReplyProps {
    icons?: string[] | undefined;
    userId: string;
    content: string;
    created_at: number;
    preview?: boolean;
    replyId: string;
    commentId: Id<'comments'>;
}

const CommentReply = ({ icons, userId, content, created_at, preview, replyId, commentId }: CommentReplyProps) => {

    const deleteReply = useMutation(api.documents.deleteCommentReply)

    const user = useQuery(api.documents.getUser, { id: userId })

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
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal role='button' className={cn(`hover:bg-gray-500 p-[1.5px] transition rounded-md`, preview && 'hidden')} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48 z-[99999] relative">
                                <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                    <DropdownMenuItem className='cursor-pointer w-full flex items-center gap-2'>
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
            <CardContent className=''>
                {content}
            </CardContent>

        </div>
    )
}

export default CommentReply