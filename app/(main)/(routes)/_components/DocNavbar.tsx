'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { ArchiveRestore, Bell, Info, Loader2, Menu, MessageCircle, MoreHorizontal, Share, Trash } from 'lucide-react'
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
import PublishButton from './PublishButton'
import { InfoSheet } from './Info'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Notifications } from './NotificationCard'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { docStatusSlice } from '@/store/reducers/DocStatusSlice'
import CommentSheet from './CommentSheet'
import { cn } from '@/lib/utils'
interface DocNavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
    isMobile: boolean;
}

const DocNavbar = ({ isCollapsed, onResetWidth, isMobile }: DocNavbarProps) => {

    const params = useParams()

    const dispatch = useAppDispatch()
    const { deleteStatus, restoreStatus } = docStatusSlice.actions
    const { isDeleting, isRestoring } = useAppSelector(state => state.docStatus)
    const [open, setOpen] = useState(false)

    console.log(params.docId)

    const doc = useQuery(api.documents.getNote, { id: params.docId as Id<"documents"> })

    const archieve = useMutation(api.documents.archiveDoc)
    const restore = useMutation(api.documents.restore)


    if (doc === undefined) {
        return (
            <div className='p-3 py-5  w-full bg-background dark:bg-dark'>
                <Skeleton className='w-[140px] h-[15px] mt-5 ' />
            </div>
        )
    }

    if (doc === null) return null

    const onArchieve = async (e: Event) => {
        try {
            dispatch(deleteStatus(true))
            e.stopPropagation()
            e.preventDefault()
            await archieve({ docId: doc._id })
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            dispatch(deleteStatus(false))
        }
    }


    const onRestore = () => {
        dispatch(restoreStatus(true))
        const promise = restore({ id: doc._id })
        toast.promise(promise, {
            loading: 'Restoring note..',
            success: 'Note restored',
            error: 'Something went wrong'
        })
        promise.finally(() => { dispatch(restoreStatus(false)) })

    }

    return (
        <div className='p-3 py-5 w-full bg-none'>
            {isCollapsed ? (
                <div className='w-[94vw] flex justify-between items-center'>
                    <Menu className='w-6 h-6 text-neutral-500' role='button' onClick={() => {
                        onResetWidth()
                        setOpen(true)
                    }} />
                    <div className='w-full flex items-center justify-between'>
                        <div>
                            <Title initialDoc={doc} />
                        </div>
                        <div className='flex items-center gap-2'>
                            <PublishButton doc={doc} />
                            <Popover>
                                <PopoverTrigger className='hover:bg-gray-300'><Bell className={cn(`w-5 h-5 mx-2 hover:bg-gray-300 p-3`)} /></PopoverTrigger>
                                <PopoverContent side='left' className='p-0 border-none' align='start' alignOffset={30}>
                                    <Notifications doc={doc} />
                                </PopoverContent>
                            </Popover>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontal role='button' className='w-8 h-8 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 rounded-lg' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48">
                                    <DropdownMenuLabel>{String(doc.title)}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                        <InfoSheet doc={doc} />
                                        {doc.isAcrchieved ? (
                                            <DropdownMenuItem disabled={isRestoring} className="cursor-pointer hover:opacity-90 w-full" onSelect={onRestore}>
                                                {isRestoring ? <Loader2 className='w-4 h-4 animate-spin' /> : <ArchiveRestore className='w-4 h-4 mr-2' />}
                                                Restore
                                            </DropdownMenuItem>
                                        ) : <DropdownMenuItem disabled={isDeleting} onSelect={onArchieve} className="cursor-pointer hover:opacity-90 w-full">
                                            {isDeleting ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : (
                                                <Trash className='w-4 h-4 mr-2' />
                                            )}
                                            Delete
                                        </DropdownMenuItem>}
                                        <CommentSheet doc={doc} />
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>

                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cn(`w-[98%] flex items-center justify-between`, isMobile && 'hidden')}>
                    <div>
                        <Title initialDoc={doc} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <PublishButton doc={doc} />
                        <Popover>
                            <PopoverTrigger><Bell className={cn(`w-5 h-5 mx-2`)} /></PopoverTrigger>
                            <PopoverContent side='left' className='p-0 border-none' align='start' alignOffset={30}>
                                <Notifications doc={doc} />
                            </PopoverContent>
                        </Popover>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal role='button' className='w-8 h-8 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 rounded-lg' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-48">
                                <DropdownMenuLabel>{String(doc.title)}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup className="flex items-center p-1 flex-col">
                                    <InfoSheet doc={doc} />
                                    {doc.isAcrchieved ? (
                                        <DropdownMenuItem disabled={isRestoring} className="cursor-pointer hover:opacity-90 w-full" onSelect={onRestore}>
                                            {isRestoring ? <Loader2 className='w-4 h-4 animate-spin' /> : <ArchiveRestore className='w-4 h-4 mr-2' />}
                                            Restore
                                        </DropdownMenuItem>
                                    ) : <DropdownMenuItem disabled={isDeleting} onSelect={onArchieve} className="cursor-pointer hover:opacity-90 w-full">
                                        {isDeleting ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : (
                                            <Trash className='w-4 h-4 mr-2' />
                                        )}
                                        Delete
                                    </DropdownMenuItem>}
                                    <CommentSheet doc={doc} />
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