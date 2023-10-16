'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { ChevronDown, ChevronRight, LucideIcon, Plus, Trash } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

interface DocProps {
    id: Id<'documents'>;
    icon?: LucideIcon;
    onExpand: () => void;
    isExpanded: boolean;
    level?: number;
    title: string;
    active?: boolean;
}

const Doc = ({ id, icon, onExpand, isExpanded, level, title }: DocProps) => {

    const Icon = isExpanded ? ChevronDown : ChevronRight

    const DocIcon = icon!

    const router = useRouter()

    const handleExpand = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        onExpand?.()
    }

    const onRedirect = () => {
        router.push(`/docs/${id}`)
    }

    const createChild = useMutation(api.documents.create)

    const onCreateChild = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        if (!id) return
        const doc = await createChild({ parentDoc: id, title: 'Untitled' })
        if (!isExpanded) {
            onExpand?.()
        }
        toast.success(`you've created new note!`)
        router.push(`/docs/${doc}`)

    }

    const archieve = useMutation(api.documents.archiveDoc)

    const onArchieve = () => {

    }

    return (
        <button onClick={onRedirect} className={cn(`dark:hover:bg-dark/70 hover:bg-gray-100 py-1 w-full items-center gap-2 text-neutral-400 transition justify-between group/note`, level && `pl-[12px] pl-[${(level * 12) + 12}px]`)}>
            <div className='flex items-center gap-1' style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}>
                <button className={cn(`p-[1px] dark:hover:bg-neutral-600 dark:hover:text-neutral-900 transition rounded-md`)} onClick={handleExpand}>
                    <Icon className='w-4 h-4' />
                </button>
                {icon && (
                    <div className=' text-[16px] flex items-center gap-2'>
                        <DocIcon className='w-5 h-5' />
                    </div>
                )}
                <span className='text-sm'>{title}</span>
                <div className='flex items-center ml-auto w-full justify-end mr-2 gap-2'>
                    <button onClick={onCreateChild} className='p-1 dark:hover:bg-neutral-950 hover:bg-neutral-500 rounded-md opacity-0 group-hover/note:opacity-100 transition'>
                        <Plus className='w-4 h-4 text-neutral-500' />
                    </button>
                    <button onClick={() => { }} className='p-1 dark:hover:bg-neutral-950 hover:bg-neutral-500 rounded-md opacity-0 group-hover/note:opacity-100 transition'>
                        <Trash className='w-4 h-4 text-neutral-500' />
                    </button>
                </div>
            </div>
        </button >
    )
}

Doc.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div className='flex gap-2 items-center' style={{ paddingLeft: level ? `${(level * 12)}px` : '12px' }}>
            <Skeleton className='h-[20px] w-[100px] text-neutral-500 bg-neutral-500 ' />
            <Skeleton className='h-4 w-[30%] text-neutral-500 bg-neutral-500 ' />
        </div>
    )
}

export default Doc