'use client'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { imageSlice } from '@/store/reducers/ImageUploadSlice'
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
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useEdgeStore } from '@/lib/edgestore'
import { SingleImageDropzone } from '../SingleImageDropzone'
import { Button } from '../ui/button'

const ImageUploadModal = () => {

    const { isOpen, id } = useAppSelector(state => state.cover)
    const dispatch = useAppDispatch()
    const { onClose, onOpen, onToggle } = imageSlice.actions
    const [file, setFile] = useState<File>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const update = useMutation(api.documents.updateDoc)

    const { edgestore } = useEdgeStore();

    if (id === undefined) return null

    const onCloseModal = () => {
        setFile(undefined)
        setIsSubmitting(false)
        dispatch(onClose())
    }

    const onAddCover = async (file: File) => {
        try {
            if (file) {
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        // you can use this to show a progress bar
                        console.log(progress);
                    },
                });
                await update({
                    id,
                    cover_image: res.url
                })
                toast.success(`cover image added`)
            }
        } catch (error) {
            toast.error('something went wrong')
            console.log(error)
        } finally {
            dispatch(onClose())
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a cover Image for this note</DialogTitle>
                    <DialogDescription className='flex items-center justify-center py-4 flex-col gap-3'>
                        <SingleImageDropzone
                            width={200}
                            height={200}
                            value={file}
                            onChange={(file) => {
                                setFile(file);
                            }}
                        />
                        <Button onClick={() => { onAddCover(file!) }}>
                            Upload
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default ImageUploadModal