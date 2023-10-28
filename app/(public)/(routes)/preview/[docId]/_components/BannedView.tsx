import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface BannedViewProps {
    doc: Doc<'documents'>
}

const BannedView = ({ doc }: BannedViewProps) => {
    return (
        <div className='w-full h-full'>
            You are not allowed to see <span className='text-lg font-bold'>{doc.title}</span> note
        </div>
    )
}

export default BannedView