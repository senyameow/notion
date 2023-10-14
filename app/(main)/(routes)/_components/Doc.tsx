'use client'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import React from 'react'

interface DocProps {
    id: Id<'documents'>;
    icon?: string;
    onExpand: () => void;
    isExpanded: boolean;
    level?: number;
    title: string;
}

const Doc = ({ id, icon, onExpand, isExpanded, level, title }: DocProps) => {

    const Icon = isExpanded ? ChevronDown : ChevronRight

    const handleExpand = () => {

    }

    return (
        <button className={cn(`dark:hover:bg-dark/70 hover:bg-gray-100 px-2 py-1 w-full items-center gap-2 text-neutral-400 transition justify-between`, level && `pl-[12px] pl-[${(level * 12) + 12}px]`)}>
            <div className='flex items-center gap-2' style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}>
                <button className={cn(``)} onClick={handleExpand}>
                    {icon ? (
                        <div className='mr-2 text-[16px]'>
                            {icon}
                        </div>
                    ) : (
                        <Icon className='w-4 h-4' />
                    )}
                </button>
                <span className='text-sm'>{title}</span>
            </div>
        </button >
    )
}

export default Doc