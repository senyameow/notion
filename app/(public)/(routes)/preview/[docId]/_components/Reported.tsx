'use client'
import { Badge } from '@/components/ui/badge';
import { Doc } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import React from 'react'

interface ReportedProps {
    report: Doc<'reports'>;
}

const Reported = ({ report }: ReportedProps) => {
    return (
        <div className='py-4 flex items-center flex-col gap-2'>
            <h2 className='text-sm'>You have already reported</h2>
            {report.isRead ? <Badge className='text-sm'>seen</Badge> : <Badge className='text-sm' variant={'destructive'}>not seen yet</Badge>
            }
        </div >
    )
}

export default Reported