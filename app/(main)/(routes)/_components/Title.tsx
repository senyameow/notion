'use client'
import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface TitleProps {
    initialDoc: Doc<'documents'>
}

const Title = ({ initialDoc }: TitleProps) => {
    return (
        <div>
            {initialDoc.title}
        </div>
    )
}

export default Title