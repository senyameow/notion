'use client'
import React, { useEffect, useState } from 'react'

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { File } from 'lucide-react'

const SearchCommand = () => {

    const docs = useQuery(api.documents.getAllUserDocs)

    const { isOpen } = useAppSelector(state => state.search)
    const { onClose } = searchSlice.actions
    const dispatch = useAppDispatch()


    const { user } = useUser()

    const router = useRouter()

    // const [isMounted, setIsMounted] = useState(false)

    // useEffect(() => {
    //     setIsMounted(true)
    // }, [])

    // if (!isMounted) return null

    const onSelect = (id: string) => {
        router.push(`docs/${id}`)
        dispatch(onClose())
    }




    return (
        <CommandDialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <CommandInput placeholder={`search ${user?.fullName}'s Notion..`} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {docs?.map(doc => (
                        <CommandItem key={doc._id} value={`${doc._id}-${doc.title}`} title={doc.title} onSelect={onSelect} className='cursor-pointer'>
                            <div className='w-full flex items-center gap-2'>
                                <File className='w-5- h-5' />
                                {doc.title}
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

export default SearchCommand