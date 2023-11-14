'use client'
import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'

interface ActionProps {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    isSearch?: boolean;
    isSettings?: boolean;
    isNew?: boolean;
}

const Action = ({ icon, label, onClick, isSearch = false, isSettings = false, isNew = false }: ActionProps) => {

    const Icon = icon

    return (
        <button onClick={onClick} className='dark:hover:bg-dark/70 hover:bg-gray-100 px-2 py-1 w-full flex flex-row items-center gap-2 text-neutral-400 transition justify-between '>
            <div className='flex items-center gap-2'>
                <Icon className='w-4 h-4' />
                <span className='text-sm'>{label}</span>
            </div>
            {isSearch && (
                <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-muted text-muted-foreground rounded font-bold'>
                    <span className='text-xs'>ctrl + k</span>
                </kbd>
            )}
            {isSettings && (
                <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-muted text-muted-foreground rounded font-bold'>
                    <span className='text-xs'>ctrl + q</span>
                </kbd>
            )}
            {isNew && (
                <kbd className='flex items-center justify-center h-fit w-fit p-1 select-none dark:bg-dark/70 bg-muted text-muted-foreground rounded font-bold'>
                    <span className='text-xs'>ctrl + v</span>
                </kbd>
            )}
        </button>
    )
}

export default Action