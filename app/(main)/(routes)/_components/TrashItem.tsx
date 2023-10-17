'use client'
import { api } from '@/convex/_generated/api'
import { Doc as DocType } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { SkipBack, StepBack, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import ConfirmModal from './modals/ConfirmModal'

interface TrashItemProps {
    doc: DocType<'documents'>
}

const TrashItem = ({ doc }: TrashItemProps) => {

    const router = useRouter()

    const onRedirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        router.push(`/docs/${doc._id}`)
    }

    const restore = useMutation(api.documents.restore)
    const remove = useMutation(api.documents.removeDoc)

    const onRestore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        try {
            await restore({ id: doc._id })
            toast.success(`you've successfully restored your note`)
        } catch (error) {
            toast.error(`something went wrong. Try again later`)
        }
    }

    const onRemove = async () => {
        try {
            await remove({ id: doc._id })
            toast.success(`you've successfully deleted your note`)
            router.push(`/documents`)
        } catch (error) {
            toast.error(`something went wrong. Try again later`)
        }
    }

    return (

        <button className='w-full group dark:hover:bg-dark/70 p-2 rounded-lg cursor-pointer'>
            <div className='w-full flex items-center justify-between'>
                <span className='text-sm'>{doc.title}</span>
                <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition'>
                    <button onClick={onRestore} className='p-1 rounded-lg  dark:hover:bg-neutral-700/70'><SkipBack className='w-5 h-5 text-neutral-500' /></button>
                    <ConfirmModal onConfirm={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}>
                        <div className='text-neutral-500 rounded-lg  dark:hover:bg-neutral-700/70 p-1'>
                            <Trash className='w-5 h-5 ' />
                        </div>
                    </ConfirmModal>
                </div>
            </div>
        </button>
    )
}

export default TrashItem