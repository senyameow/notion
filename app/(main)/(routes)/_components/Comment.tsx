'use client'
import { Doc } from '@/convex/_generated/dataModel';
import React from 'react'

interface CommentProps {
    userId: string;
    content: string;
    commentLine: string;
    isReviewed: boolean;
    created_at: string;
}

const Comment = () => {
    return (
        <div>Comment</div>
    )
}

export default Comment