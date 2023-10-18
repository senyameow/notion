'use client'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { imageSlice } from '@/store/reducers/ImageUploadSlice'
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const ImageUploadModal = () => {

    const { isOpen } = useAppSelector(state => state.cover)
    const dispatch = useAppDispatch()
    const { onClose, onOpen, onToggle } = imageSlice.actions

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ImageUploadModal