'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'

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

    const handleExpand = (e: any) => {
        e.stopPropagation()
        e.preventDefault()

    }

    const onRedirect = () => {
        router.push(`/documents/${id}`)
    }

    return (
        <button onClick={onRedirect} className={cn(`dark:hover:bg-dark/70 hover:bg-gray-100 py-1 w-full items-center gap-2 text-neutral-400 transition justify-between`, level && `pl-[12px] pl-[${(level * 12) + 12}px]`)}>
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
            </div>
        </button >
    )
}

Doc.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div className='flex gap-2 items-center' style={{ paddingLeft: level ? `${(level * 12) + 25}px` : '12px' }}>
            <Skeleton className='h-4 w-4 text-white' />
            <Skeleton className='h-4 w-[30%] text-white' />
        </div>
    )
}

export default Doc