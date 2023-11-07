
import React, { useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteCommentModalSlice } from '@/store/reducers/DeleteCommentModalSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

const DeleteCommentModal = () => {

    const { onClose } = deleteCommentModalSlice.actions
    const { isOpen, commentId } = useAppSelector(state => state.deleteComment)
    const dispatch = useAppDispatch()

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteComment = useMutation(api.documents.deleteComment)

    const onDeleteComment = async () => {
        try {
            setIsDeleting(true)
            await deleteComment({
                commentId: commentId!
            })
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsDeleting(false)
            dispatch(onClose())
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className='w-full'>
                <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        You will permanently delete your comment
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='w-full flex items-center justify-between'>
                    <Button className='mr-auto' variant={'outline'} onClick={() => dispatch(onClose())}>
                        Cancel
                    </Button>
                    <Button disabled={isDeleting} onClick={onDeleteComment}>
                        {isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCommentModal