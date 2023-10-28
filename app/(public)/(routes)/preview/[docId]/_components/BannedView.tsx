'use client'
import { Button } from '@/components/ui/button'
import { Doc } from '@/convex/_generated/dataModel'
import { useAppDispatch } from '@/hooks/redux';
import { reportModalSlice } from '@/store/reducers/ReportModalSlice';
import { Loader2 } from 'lucide-react';
import React from 'react'

interface BannedViewProps {
    doc: Doc<'documents'>;
    userId: string | undefined
}

const BannedView = ({ doc, userId }: BannedViewProps) => {

    const dispatch = useAppDispatch()
    const { onOpen } = reportModalSlice.actions

    return (
        <div className='w-screen h-screen text-xl flex items-center justify-center'>
            <div className='w-full h-full flex items-center justify-center flex-col gap-4'>
                <div className='flex items-center'>
                    You are not allowed to see <div className='ml-1'></div>
                    <div className='text-2xl font-bold mr-1'> {doc.title} </div> note
                </div>
                <Button disabled={userId === undefined} onClick={() => dispatch(onOpen({ userId, docId: doc._id }))}>
                    {userId === undefined ? <Loader2 className='w-4 h-4 animate-spin' /> : <span>Report</span>}
                </Button>
            </div>
        </div>
    )
}

export default BannedView