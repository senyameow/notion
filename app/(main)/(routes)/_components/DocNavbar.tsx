'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { ArchiveRestore, Info, Loader2, Menu, MessageCircle, MoreHorizontal, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import Title from './Title'
import { Button } from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@clerk/clerk-react'
import { toast } from 'sonner'
interface DocNavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const DocNavbar = ({ isCollapsed, onResetWidth }: DocNavbarProps) => {

    const params = useParams()

    const [isDeleting, setIsDeleting] = useState(false)

    const doc = useQuery(api.documents.getNote, { id: params.docId as Id<"documents"> })

    if (doc === undefined) {
        return (
            <div className='p-3 py-5 pr-5 w-full bg-background dark:bg-dark'>
                <Skeleton className='w-[140px] h-[15px] mt-5 ' />
            </div>
        )
    }

    if (doc === null) return null

    const archieve = useMutation(api.documents.archiveDoc)
    const onArchieve = async (e: Event) => {
        try {
            e.stopPropagation()
            e.preventDefault()
            setIsDeleting(true)
            await archieve({ docId: doc._id })
            toast.success(`you've deleted ${doc.title}`)
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsDeleting(false)
        }
    }

    const restore = useMutation(api.documents.restore)

    const onRestore = () => {
        const promise = restore({ id: doc._id })
        toast.promise(promise, {
            loading: 'Restoring note..',
            success: 'Note restored',
            error: 'Something went wrong'
        })

    }

    return (
        <div className='p-3 py-5 pr-5 w-full bg-background dark:bg-dark'>
            {isCollapsed ? (
                <Menu className='w-6 h-6 text-neutral-500' role='button' onClick={onResetWidth} />
            ) : (
                <div className='w-full flex items-center justify-between'>
                    <div>
                        <Title initialDoc={doc} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button className='' variant={'ghost'}>Publish</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal role='button' className='w-8 h-8 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 rounded-lg' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48">
                                <DropdownMenuLabel>{String(doc.title)}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                    <DropdownMenuItem className="cursor-pointer hover:opacity-90 w-full">
                                        <Info className='w-4 h-4 mr-2' />
                                        Info
                                    </DropdownMenuItem>
                                    {doc.isAcrchieved ? (
                                        <DropdownMenuItem className="cursor-pointer hover:opacity-90 w-full" onSelect={onRestore}>
                                            <ArchiveRestore className='w-4 h-4 mr-2' />
                                            Restore
                                        </DropdownMenuItem>
                                    ) : <DropdownMenuItem disabled={isDeleting} onSelect={onArchieve} className="cursor-pointer hover:opacity-90 w-full">
                                        {isDeleting ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : (
                                            <Trash className='w-4 h-4 mr-2' />
                                        )}
                                        Delete
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem className="cursor-pointer hover:opacity-90 w-full">
                                        <MessageCircle className='w-4 h-4 mr-2' />
                                        Comments
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}

        </div >
    )
}

export default DocNavbar