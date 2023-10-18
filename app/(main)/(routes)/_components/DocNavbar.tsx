'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import Title from './Title'

interface DocNavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const DocNavbar = ({ isCollapsed, onResetWidth }: DocNavbarProps) => {

    const params = useParams()

    const doc = useQuery(api.documents.getNote, { id: params.docId as Id<"documents"> })

    if (doc === undefined) {
        return (
            <div className='p-3 py-5 pr-5 w-full bg-background dark:bg-dark'>
                <Skeleton className='w-[140px] h-[15px] mt-5 ' />
            </div>
        )
    }

    if (doc === null) return null

    return (
        <div className='p-3 py-5 pr-5 w-full bg-background dark:bg-dark'>
            {isCollapsed ? (
                <Menu className='w-6 h-6 text-neutral-500' role='button' onClick={onResetWidth} />
            ) : (
                <div className='w-full flex items-center justify-between'>
                    <div>
                        <Title initialDoc={doc} />
                    </div>
                    <div>
                        publish
                    </div>
                </div>
            )}

        </div >
    )
}

export default DocNavbar