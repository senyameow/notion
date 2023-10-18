'use client'
import { EmojiPicker } from '@/components/EmojiPicker';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react';
import { Loader2, Smile } from 'lucide-react'
import React from 'react'

interface ToolbarProps {
    initialDoc: Doc<'documents'>;
    preview?: boolean;
}

const Toolbar = ({
    initialDoc,
    preview
}: ToolbarProps) => {

    const update = useMutation(api.documents.updateDoc)

    if (initialDoc === undefined) {
        return (
            <div className=''>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }
    if (initialDoc === null) return null

    const onChangeIcon = (emoji: string) => {
        update({
            id: initialDoc._id,
            icon: emoji
        })
    }

    return (
        <div className='flex flex-col gap-3 items-start group'>
            {!!initialDoc && !preview && <div className='flex flex-row items-center gap-1 group/icons pt-6'>
                <EmojiPicker onChange={onChangeIcon}>
                    <Button>
                        <Smile className='w-3 h-3 mr-2' />
                        Add Icon
                    </Button>
                </EmojiPicker>
                <div>add image</div>
            </div>}
            <div>
                {initialDoc.title}
            </div>
        </div>
    )
}

export default Toolbar