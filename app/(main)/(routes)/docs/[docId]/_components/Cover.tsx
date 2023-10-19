'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { updateDoc } from '@/convex/documents'
import { useAppDispatch } from '@/hooks/redux'
import { imageSlice } from '@/store/reducers/ImageUploadSlice'
import { useMutation } from 'convex/react'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface CoverProps {
    doc: Doc<'documents'>;
    preview?: boolean
}

const Cover = ({ doc, preview }: CoverProps) => {

    const { onOpen } = imageSlice.actions
    const dispatch = useAppDispatch()
    const update = useMutation(api.documents.updateDoc)

    const [isLoading, setIsLoading] = useState(false)

    if (doc === undefined) {
        return (
            <div className='w-full h-[300px] flex items-center justify-center'>
                <Loader2 className='animate-spin w-12 h-12' />
            </div>
        )
    }

    if (doc === null) {
        return (
            <div className='w-full h-[200px]' />
        )
    }

    const onRemoveImage = async () => {
        try {
            await update({
                id: doc._id,
                cover_image: ''
            })
        } catch (error) {
            toast.error('something went wrong')
        } finally {

        }
    }

    return (
        <>
            {doc?.cover_image && (
                <div className='w-full h-[300px] relative group'>
                    <Image src={doc.cover_image} alt='cover' className='object-cover' fill />
                    {!preview && <Button onClick={() => dispatch(onOpen(doc._id))} className='absolute bottom-2 opacity-0 right-32 group-hover:opacity-100 transition'>
                        Change Cover
                    </Button>}
                    {!preview && doc.cover_image && <Button disabled={isLoading} onClick={onRemoveImage} className='absolute bottom-2 opacity-0 right-2 group-hover:opacity-100 transition'>
                        {isLoading ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <X className='w-4 h-4 mr-2' />}
                        remove
                    </Button>}
                </div>
            )}
        </>
    )
}

export default Cover