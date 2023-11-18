import { Id } from '@/convex/_generated/dataModel';
import React from 'react'
import { Button } from './ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { docStatusSlice } from '@/store/reducers/DocStatusSlice';
import { Loader2 } from 'lucide-react';


interface BannerProps {
    docId: Id<'documents'>
    text: string;
}

const Banner = ({
    docId,
    text,
}: BannerProps) => {

    const restore = useMutation(api.documents.restore)

    const remove = useMutation(api.documents.removeDoc).withOptimisticUpdate(
        (localStorage, args) => {
            const currentDoc = localStorage.getQuery(api.documents.getNote, { id: args.id })
            if (currentDoc !== undefined) {
                localStorage.setQuery(api.documents.getNote, { id: args.id }, null)
            }
        }
    )
    const router = useRouter()

    const dispatch = useAppDispatch()
    const { deleteStatus, restoreStatus } = docStatusSlice.actions

    const { isDeleting, isRestoring } = useAppSelector(state => state.docStatus)

    const onRemove = () => {
        dispatch(deleteStatus(true))
        // const promise = remove({ id: docId })
        // toast.promise(promise, {
        //     loading: 'Deleting note..',
        //     success: 'Note deleted',
        //     error: 'Something went wrong'
        // })
        remove({ id: docId })
        dispatch(deleteStatus(false))
        router.push(`/docs`)
    }
    const onRestore = () => {
        dispatch(restoreStatus(true))
        const promise = restore({ id: docId })
        toast.promise(promise, {
            loading: 'Restoring note..',
            success: 'Note restored',
            error: 'Something went wrong'
        })
        dispatch(restoreStatus(false))
    }

    return (
        <div className='w-full h-12 py-1 bg-rose-500'>
            <div className='w-full flex items-center justify-center'>
                <div className='flex items-center gap-4 w-fit'>
                    <span className=''>{text}</span>
                    <Button onClick={onRestore} className='bg-transparent border border-white' variant={'ghost'}>
                        {isRestoring ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Restore note'}
                    </Button>
                    <Button onClick={onRemove} className='bg-transparent border border-white' variant={'ghost'}>
                        {isDeleting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Delete note'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Banner