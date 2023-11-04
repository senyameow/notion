
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteCommentModalSlice } from '@/store/reducers/DeleteCommentModalSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const DeleteCommentModal = () => {

    const { onClose } = deleteCommentModalSlice.actions
    const { isOpen, commentId } = useAppSelector(state => state.deleteComment)
    const dispatch = useAppDispatch()

    const deleteComment = useMutation(api.documents.deleteComment)

    const onDeleteComment = () => {

    }

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        You will permanently delete your comment
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCommentModal