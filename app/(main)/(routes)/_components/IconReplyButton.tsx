'use client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import React from 'react'
import { toast } from 'sonner';
import { string } from 'zod'

interface IconReplyButtonProps {
    icon: {
        icon?: string | undefined
        amount?: number | undefined
    };
    replyId?: string;
    commentId: Id<'comments'>;
    icons: { icon?: string | undefined; amount?: number | undefined, userId: string[] }[];
    userId: string
}

const IconReplyButton = ({ icon, replyId, commentId, icons, userId }: IconReplyButtonProps) => {

    const updateIcon = useMutation(api.documents.addIconCommentReply)

    const isAdded = !!icons.find(obj => obj.userId.includes(userId))

    const onUpdateIcon = async () => {
        try {
            await updateIcon({
                replyId: replyId!,
                commentId,
                icon: icon.icon!
            })
        } catch (error) {
            toast.error('something went wrong')
        }
    }

    return (
        <button onClick={onUpdateIcon} className={cn(`flex items-center gap-1 border-[0.5px] transition rounded-md px-1 py-[0.5px] bg-blue-700 bg-opacity-40 hover:bg-opacity-80 border-blue-7`, isAdded && 'bg-opacity-80 hover:bg-opacity-60')} >
            <span>{icon.icon}</span>
            <span>{icon.amount}</span>
        </button>
    )
}

export default IconReplyButton