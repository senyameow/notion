import { ScrollArea } from '@/components/ui/scroll-area'
import { Doc as DocType } from '@/convex/_generated/dataModel'
import React from 'react'
import Doc from './Doc'
import TrashItem from './TrashItem'

interface TrashBoxProps {
    docs: DocType<'documents'>[] | undefined
}

const TrashBox = ({ docs }: TrashBoxProps) => {

    if (docs === undefined) {
        return (
            <div className='w-full'>
                <Doc.Skeleton level={0} />
            </div>
        )
    }

    return (
        <ScrollArea className='w-full h-[230px]'>
            <div className='flex flex-col w-full'>
                {docs.map(doc => (
                    <TrashItem doc={doc} />
                ))}
            </div>
        </ScrollArea>
    )
}

export default TrashBox