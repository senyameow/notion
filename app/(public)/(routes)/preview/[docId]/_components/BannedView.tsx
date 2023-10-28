'use client'
import { Button } from '@/components/ui/button'
import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface BannedViewProps {
    doc: Doc<'documents'>
}

const BannedView = ({ doc }: BannedViewProps) => {
    return (
        <div className='w-screen h-screen text-xl flex items-center justify-center'>
            <div className='w-full h-full flex items-center justify-center flex-col gap-4'>
                <div className='flex items-center'>
                    You are not allowed to see <div className='ml-1'></div>
                    <div className='text-2xl font-bold mr-1'> {doc.title} </div> note
                </div>
                <Button onClick={() => { }}>Report</Button>
            </div>
        </div>
    )
}

export default BannedView