'use client'
import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface DocCardProps {
    doc: Doc<'documents'>
}

const DocCard = ({ doc }: DocCardProps) => {
    return (
        <div>
            {doc.title}
        </div>
    )
}

export default DocCard