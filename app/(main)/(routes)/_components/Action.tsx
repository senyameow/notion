'use client'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface ActionProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}

const Action = ({ icon, label, onClick }: ActionProps) => {

    const Icon = icon

    return (
        <button onClick={onClick} className='dark:hover:bg-dark/70 hover:bg-gray-100 px-2 py-1 w-full flex flex-row items-center gap-2 text-neutral-400 transition justify-between '>
            <div className='flex items-center gap-2'>
                <Icon className='w-4 h-4' />
                <span className='text-sm'>{label}</span>
            </div>
        </button>
    )
}

export default Action