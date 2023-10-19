'use client'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { ImageUploadPayload, imageSlice } from '@/store/reducers/ImageUploadSlice'
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
import { Loader2 } from 'lucide-react'

const ImageUploadModal = () => {

    const { isOpen, id, type, image_url } = useAppSelector(state => state.cover)
    const dispatch = useAppDispatch()
    const { onClose, onStore } = imageSlice.actions
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

    console.log(image_url)

    const onCover = async (file: File, type: 'change' | 'add') => {
        try {
            setIsSubmitting(true)
            if (file && type === 'add') {
                const res = await edgestore.publicFiles.upload({
                    file,
                });
                await update({
                    id,
                    cover_image: res.url
                })
                dispatch(onStore(res.url)) // и в редакс кинули
                toast.success(`cover image added`)
            }
            if (file && type === 'change' && image_url) {
                const res = await edgestore.publicFiles.upload({
                    file,
                    options: {
                        replaceTargetUrl: image_url!
                    }
                });
                await update({
                    id,
                    cover_image: res.url
                })
                // dispatch(onStore(res.url)) // и в редакс кинули
                toast.success(`cover image changes`)
            }
        } catch (error) {
            toast.error('something went wrong')
            console.log(error)
        } finally {
            dispatch(onClose())
            setIsSubmitting(false)
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
                        {type === 'add' && <Button disabled={isSubmitting} onClick={() => { onCover(file!, type) }}>
                            {isSubmitting ? (
                                <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                                <div>
                                    Upload
                                </div>
                            )}
                        </Button>}
                        {type === 'change' && <Button disabled={isSubmitting} onClick={() => { onCover(file!, type) }}>
                            {isSubmitting ? (
                                <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                                <div>
                                    Change
                                </div>
                            )}
                        </Button>}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default ImageUploadModal