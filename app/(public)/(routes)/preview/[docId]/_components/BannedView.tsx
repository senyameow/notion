'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel'
import { useAppDispatch } from '@/hooks/redux';
import { reportModalSlice } from '@/store/reducers/ReportModalSlice';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React from 'react'
import Reported from './Reported';

interface BannedViewProps {
    doc: Doc<'documents'>;
    userId: string
}

const BannedView = ({ doc, userId }: BannedViewProps) => {

    const dispatch = useAppDispatch()
    const { onOpen } = reportModalSlice.actions

    const report = useQuery(api.documents.report, { docId: doc._id, userId: userId })

    return (
        <div className='w-screen h-screen text-xl flex items-center justify-center'>
            <div className='w-full h-full flex items-center justify-center flex-col gap-4'>
                <div className='flex items-center'>
                    You are not allowed to see <div className='ml-1'></div>
                    <div className='text-2xl font-bold mr-1'> {doc.title} </div> note
                </div>
                {report === undefined ? (
                    <div>loading</div>
                ) : <>
                    {report === null && report !== undefined && <Button disabled={userId === undefined} onClick={() => dispatch(onOpen({ userId, docId: doc._id }))}>
                        {userId === undefined ? <Loader2 className='w-4 h-4 animate-spin' /> : <span>Report</span>}
                    </Button>}
                    {report && <Reported report={report} />}
                </>}
            </div>
        </div>
    )
}

export default BannedView