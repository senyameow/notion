import { Doc } from '@/convex/_generated/dataModel'
import React, { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Loader2, Trash } from 'lucide-react';
import UserReport from './UserReport';
import UserComment from './UserComment';

interface CommentCardProps {
    comment: Doc<'comments'>
}

const CommentCard = ({ comment }: CommentCardProps) => {

    const change = useMutation(api.documents.updateCommentNotification)


    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        try {
            setIsDeleting(true)
            await change({
                commentId: comment._id,
                isDeleted: true
            })
            toast.success(`deleted`)
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsDeleting(false)
        }
    }

    const onRead = () => {
        setTimeout(() => {
            change({
                commentId: comment._id,
                isRead: true
            })
        }, 500);
    }

    return (
        <Popover>
            <PopoverTrigger asChild className='w-[430px]'>
                <div
                    onClick={onRead}
                    key={comment._id}
                    className="mb-4 w-full grid relative grid-cols-[25px_1fr] group items-start pb-4 last:mb-0 last:pb-2  p-3 group hover:bg-gray-900 transition rounded-lg cursor-pointer"
                >
                    <span className={cn(`flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 opacity-100 transition duration-300`, comment.isRead && 'opacity-0')} />
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none max-w-[340px] mr-[10px] truncate">
                            {comment.commentLine}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {format(comment._creationTime, 'PPPpp')}
                        </p>
                    </div>
                    <Button disabled={isDeleting} onClick={onDelete} size={'icon'} variant={'outline'} className='absolute group-hover:opacity-100 top-2 right-2 hover:opacity-60 opacity-0 transition'>{isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash className='w-4 h-4' />}</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent align='start' side='left'>
                <UserComment comment={comment} />
            </PopoverContent>
        </Popover>
    )
}

export default CommentCard