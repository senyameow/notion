'use client'
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts';

interface ActionProps {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    isSearch?: boolean;
    isSettings?: boolean;
    isNew?: boolean;
    isPomoyka?: boolean
}

const Action = ({ icon, label, onClick, isSearch = false, isSettings = false, isNew = false, isPomoyka = false }: ActionProps) => {

    const Icon = icon
    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <button onClick={onClick} className={cn(`dark:hover:bg-dark/70 hover:bg-gray-200 px-2 py-1 w-full flex flex-row items-center gap-2 text-neutral-400 transition justify-between `, isMobile && 'p-2 py-4 flex items-center justify-center')}>
            <div className='flex items-center gap-2'>
                <Icon className={cn(`w-4 h-4`, isMobile && 'w-8 h-8')} />
                {(!isPomoyka || !isMobile) && !isMobile && < span className={cn(`text-sm`, isMobile && 'text-lg')}>{label}</span>}
            </div>
            {
                isSearch && !isMobile && (
                    <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-neutral-300 text-muted-foreground rounded font-bold'>
                        <span className='text-xs'>ctrl + k</span>
                    </kbd>
                )
            }
            {
                isSettings && !isMobile && (
                    <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-neutral-300 text-muted-foreground rounded font-bold'>
                        <span className='text-xs'>ctrl + q</span>
                    </kbd>
                )
            }
            {
                isNew && !isMobile && (
                    <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-neutral-300 text-muted-foreground rounded font-bold'>
                        <span className='text-xs'>ctrl + m</span>
                    </kbd>
                )
            }
        </button >
    )
}

export default Action