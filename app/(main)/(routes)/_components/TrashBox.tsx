'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Doc as DocType } from '@/convex/_generated/dataModel'
import React, { useState } from 'react'
import Doc from './Doc'
import TrashItem from './TrashItem'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface TrashBoxProps {
    docs: DocType<'documents'>[] | undefined
}

const TrashBox = ({ docs }: TrashBoxProps) => {

    const [search, setSearch] = useState('')

    if (docs === undefined) {
        return (
            <div className='w-full'>
                <Doc.Skeleton level={0} />
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex items-center gap-1 p-2 relative border py-0 rounded-lg mb-2 w-full'>
                <Search className='w-4 h-4' />
                <Input value={search} placeholder='filter by title...' className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0' onChange={e => setSearch(e.target.value)} />
            </div>

            {docs.length > 0 ? < ScrollArea className='w-full h-[230px]'>
                <div className='flex flex-col w-full'>
                    {docs.map(doc => (
                        <TrashItem doc={doc} />
                    ))}
                </div>
            </ScrollArea> : <p className='text-neutral-500 text-sm text-center hidden last:block font-semibold py-4'>No documents found..</p>}
        </div >
    )
}

export default TrashBox