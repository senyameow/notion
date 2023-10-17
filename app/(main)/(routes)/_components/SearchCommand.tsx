'use client'
import React, { useEffect, useState } from 'react'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { getAllDocs } from '@/convex/documents'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { modalSlice } from '@/store/reducers/ModalSlice'
import { useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'

const SearchCommand = () => {

    const docs = useQuery(api.documents.getAllDocs)

    const { onToggle, onClose } = modalSlice.actions
    const { isOpen } = useAppSelector(state => state.modal)

    const [isMounted, setIsMounted] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <Command>
            <CommandInput placeholder={`search ${user?.fullName}'s Notion..`} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {docs?.map(doc => (
                        <CommandItem key={doc._id} value={`${doc._id}-${doc.title}`} title={doc.title} onSelect={() => { }} className=''>
                            {doc.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                    <CommandItem>Settings</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

export default SearchCommand