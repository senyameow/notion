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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
        // const promise = remove({ id: docId })
        // toast.promise(promise, {
        //     loading: 'Deleting note..',
        //     success: 'Note deleted',
        //     error: 'Something went wrong'
        // })
        remove({ id: docId })
        toast.success('deleted')
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
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className='bg-transparent border border-white' variant={'ghost'}>
                                Delete Note
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your document
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onRemove}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>


                </div>
            </div>
        </div>
    )
}

export default Banner