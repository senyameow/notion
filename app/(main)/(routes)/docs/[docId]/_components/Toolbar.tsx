'use client'
import { EmojiPicker } from '@/components/EmojiPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel'
import { useAppDispatch } from '@/hooks/redux';
import { imageSlice } from '@/store/reducers/ImageUploadSlice';
import { useMutation } from 'convex/react';
import { Image, Loader2, Smile, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

import TextArea from 'react-textarea-autosize'
import { toast } from 'sonner';

interface ToolbarProps {
    initialDoc: Doc<'documents'>;
    preview?: boolean;
}

const Toolbar = ({
    initialDoc,
    preview
}: ToolbarProps) => {

    const update = useMutation(api.documents.updateDoc)

    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [title, setTitle] = useState(initialDoc?.title || 'Untitled')
    const [editing, setEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (preview) return
        update({
            title: e.target.value || 'Untitled',
            id: initialDoc._id
        })
        setTitle(e.target.value)
    }

    const onSave = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            setEditing(false)
        }
    }

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


    const onRemoveIcon = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            setIsDeleting(true)
            e.stopPropagation()
            await update({
                id: initialDoc._id,
                icon: ''
            })
            toast.success(`you've deleted icon`)
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsDeleting(false)
        }
    }

    const enableInput = () => {
        setTitle(initialDoc.title)
        setEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0);
    }

    const dispatch = useAppDispatch()
    const { onOpen } = imageSlice.actions

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
                    <Button onClick={() => dispatch(onOpen())} className='border-[0.7px] border-neutral-100' variant={'ghost'}>
                        <Image className='w-4 h-4 mr-2' />
                        Add cover
                    </Button>
                )}
            </div>}
            {!!initialDoc.icon && !preview && (
                <EmojiPicker onChange={onChangeIcon}>
                    <div className='text-6xl py-6 relative group/icon'>
                        {isDeleting ? <Loader2 className='animate-spin w-12 h-12' /> : initialDoc.icon}
                        <Button onClick={onRemoveIcon} variant={'destructive'} className='opacity-0 group-hover/icon:opacity-100 transition rounded-full h-fit p-1 hover:opacity-90 absolute top-5 right-3'>
                            <X className='w-4 h-4' />
                        </Button>
                    </div>
                </EmojiPicker>
            )}

            <>
                {editing ? (
                    <TextArea onBlur={() => setEditing(false)} value={title || 'Untitled'} onKeyDown={onSave} onChange={onChangeTitle} ref={inputRef} className='resize-none text-6xl font-bold bg-transparent py-0 border-none focus-visible:border-none h-fit w-fit focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                ) : (
                    <div className='text-6xl font-bold' onClick={enableInput}>
                        {title || 'Untitled'}
                    </div>
                )}
            </>
        </div>
    )
}

export default Toolbar