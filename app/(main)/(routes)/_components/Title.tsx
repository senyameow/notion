'use client'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import React, { KeyboardEventHandler, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface TitleProps {
    initialDoc: Doc<'documents'>
}

const Title = ({ initialDoc }: TitleProps) => {

    const changeTitle = useMutation(api.documents.updateDoc)
    const inputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState(initialDoc.title || 'Untitled')

    const [editing, setEditing] = useState(false)

    const enableInput = () => {
        setTitle(initialDoc.title)
        setEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
    }

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        changeTitle({
            title: e.target.value || 'Untitled',
            id: initialDoc._id
        })
        setTitle(e.target.value)

    }

    const onSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditing(false)
        }
    }

    return (
        <>
            {editing ? <Input ref={inputRef} onBlur={() => setEditing(false)} onKeyDown={onSave} className='h-7 bg-transparent py-0 border border-neutral-500 focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' onChange={onChangeTitle} value={title || 'Untitled'} /> : <Button variant={'ghost'} onClick={enableInput} className='w-fit px-2 py-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition rounded-xl'>
                {initialDoc.title}
            </Button>}

        </>
    )
}

export default Title