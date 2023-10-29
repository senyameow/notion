'use client'
import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface ReportedProps {
    report: Doc<'reports'>;
}

const Reported = ({ report }: ReportedProps) => {
    return (
        <div>Reported</div>
    )
}

export default Reported