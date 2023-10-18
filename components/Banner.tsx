import { Id } from '@/convex/_generated/dataModel';
import React from 'react'
import { Button } from './ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';


interface BannerProps {
    docId: Id<'documents'>
    text: string;
}

const Banner = ({
    docId,
    text,
}: BannerProps) => {

    const restore = useMutation(api.documents.restore)
    const remove = useMutation(api.documents.removeDoc)

    const onRemove = () => {
        const promise = remove({ id: docId })
        toast.promise(promise, {
            loading: 'Deleting note..',
            success: 'Note deleted',
            error: 'Something went wrong'
        })

    }
    const onRestore = () => {
        const promise = restore({ id: docId })
        toast.promise(promise, {
            loading: 'Restoring note..',
            success: 'Note deleted',
            error: 'Something went wrong'
        })

    }

    return (
        <div className='w-full h-12 py-1 bg-rose-500'>
            <div className='w-full flex items-center justify-center'>
                <div className='flex items-center gap-4 w-fit'>
                    <span className=''>{text}</span>
                    <Button onClick={onRestore} className='bg-transparent border border-white' variant={'ghost'}>Restore note</Button>
                    <Button onClick={onRemove} className='bg-transparent border border-white' variant={'ghost'}>Delete note</Button>
                </div>
            </div>
        </div>
    )
}

export default Banner