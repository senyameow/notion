'use client'
import { ActionTooltip } from '@/components/ui/ActionTooltip'
import { Doc } from '@/convex/_generated/dataModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface DocCardProps {
    doc: Doc<'documents'>;
    preview?: boolean
}

const DocCard = ({ doc, preview }: DocCardProps) => {
    const path = preview ? 'preview' : 'docs'
    return (
        <Link href={`/${path}/${doc._id}`} className='w-full h-[100px] relative border'>
            <ActionTooltip label={doc.title} side='top' align='center'>

                {doc.cover_image ? <Image src={doc.cover_image} alt='doc image' className='object-cover' fill /> : (
                    <div className='w-full h-full flex items-center justify-center'>
                        {doc.title}
                    </div>
                )}
            </ActionTooltip>

        </Link>
    )
}

export default DocCard