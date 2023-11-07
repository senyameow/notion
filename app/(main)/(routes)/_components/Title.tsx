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

    const inputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState(initialDoc.title || 'Untitled')

    const changeTitle = useMutation(api.documents.updateDoc).withOptimisticUpdate(
        (localStorage, args) => {
            const { id, ...rest } = args
            const currentValue = localStorage.getQuery(api.documents.getNote, { id: initialDoc._id })
            if (currentValue !== undefined && currentValue !== null) {
                localStorage.setQuery(api.documents.getNote, { id: currentValue._id }, { ...currentValue, ...rest })
            }
        }
    )

    const [editing, setEditing] = useState(false)

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 32) return
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

    const enableInput = () => {
        setTitle(initialDoc.title)
        setEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 300);
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