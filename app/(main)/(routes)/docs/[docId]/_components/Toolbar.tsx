'use client'
import { EmojiPicker } from '@/components/EmojiPicker';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react';
import { Image, Loader2, Smile, X } from 'lucide-react'
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
    const onRemoveIcon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        update({
            id: initialDoc._id,
            icon: ''
        })
    }

    return (
        <div className='flex flex-col gap-3 items-start group'>
            {!preview && <div className='flex flex-row items-center gap-2 group/icons pt-6 opacity-0 group-hover:opacity-100 transition'>
                {!initialDoc.icon && <EmojiPicker onChange={onChangeIcon}>
                    {<Button variant={'ghost'} className='border-[0.7px] border-neutral-100'>
                        <Smile className='w-4 h-4 mr-2' />
                        Add Icon
                    </Button>}
                </EmojiPicker>}
                {!initialDoc.cover_image && (
                    <Button className='border-[0.7px] border-neutral-100' variant={'ghost'}>
                        <Image className='w-4 h-4 mr-2' />
                        Add cover
                    </Button>
                )}
            </div>}
            {!!initialDoc.icon && !preview && (
                <EmojiPicker onChange={onChangeIcon}>
                    <div className='text-6xl py-6 relative'>
                        {initialDoc.icon}
                        <Button onClick={onRemoveIcon} variant={'destructive'} className='rounded-full h-fit p-1 hover:opacity-90 absolute top-5 right-3'>
                            <X className='w-4 h-4' />
                        </Button>
                    </div>
                </EmojiPicker>
            )}

            <div>
                {initialDoc.title}
            </div>
        </div>
    )
}

export default Toolbar