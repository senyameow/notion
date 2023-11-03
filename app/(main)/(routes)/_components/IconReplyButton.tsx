'use client'
import { Id } from '@/convex/_generated/dataModel';
import React from 'react'
import { string } from 'zod'

interface IconReplyButtonProps {
    icon: {
        icon?: string | undefined
        amount?: number | undefined
    };
    replyId: string;
    commentId: Id<'comments'>;
    icons: { icon?: string | undefined; amount?: number | undefined }[]
}

const IconReplyButton = ({ icon, replyId, commentId, icons }: IconReplyButtonProps) => {


    const numberOfIcon = icons.reduce((acc, c) => {
        if (icon.icon === c.icon) return acc + 1
        return acc
    }, 0)

    console.log(numberOfIcon)

    return (
        <button onClick={() => { }} className='flex items-center gap-1 border-[0.5px] transition rounded-md px-1 py-[0.5px] bg-blue-700 bg-opacity-25 hover:bg-opacity-40 border-blue-7' >
            <span>{icon.icon}</span>
            <span>{icon.amount}</span>
        </button>
    )
}

export default IconReplyButton