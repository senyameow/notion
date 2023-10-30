'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useAppDispatch } from '@/hooks/redux'
import { cn } from '@/lib/utils'
import { userModalSlice } from '@/store/reducers/UserModalSlice'
import { useMutation } from 'convex/react'
import { Ban, Check, Info, Loader2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import UserRole, { UserRoles } from './UserRole'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserCardProps {
    user: Doc<'users'>;
    preview?: boolean;
    doc: Doc<'documents'>;
}

const UserCard = ({ user, preview, doc }: UserCardProps) => {

    const dispatch = useAppDispatch()
    const { onOpen } = userModalSlice.actions
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const ban = useMutation(api.documents.banUser)

    let isBanned = doc.banList?.includes(user.userId)

    const userRole = user.docRole?.find(user => user.docId === doc._id)?.role

    const onBan = async () => {
        try {
            setIsLoading(true)
            await ban({ id: user.userId, docId: doc._id })
            toast.success(`${user.name} won't be able to see ${doc.title}`)
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full p-3 group border cursor-pointer relative">
            <div className="flex items-center w-full justify-between">
                <div className='flex items-center gap-2'>
                    <Image src={user?.image_url} alt='user image' width={30} height={30} className='rounded-full ' />
                    <span>{user?.name}</span>
                </div>
            </div>
            <div className={cn(`flex items-center gap-2 absolute top-2 right-3`)}>

                {(userRole === 'ADMIN' || userRole === 'MOD') ? <DropdownMenu>
                    <DropdownMenuTrigger>
                        <UserRole role={UserRoles.ADMIN} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-36">
                        <DropdownMenuGroup className="flex items-center p-1 flex-col">
                            <DropdownMenuItem className='flex w-full items-center justify-between gap-3 cursor-pointer'>
                                <div className='flex w-full items-center gap-3'>
                                    {<UserRole role={UserRoles.ADMIN} />}
                                    <span>admin</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex w-full justify-between items-center gap-3 cursor-pointer'>
                                <div className='flex w-full items-center gap-3'>
                                    {<UserRole role={UserRoles.EDITOR} />}
                                    <span>editor</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex w-full items-center gap-3 cursor-pointer'>
                                <div className='w-full flex items-center gap-3'>
                                    {<UserRole role={UserRoles.MOD} />}
                                    <span>mod</span>
                                </div>
                                <Check className={cn(`w-4 h-4 opacity-0`, userRole === UserRoles.MOD && 'opacity-100')} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex w-full items-center gap-3 cursor-pointer'>
                                <div className='w-full flex items-center gap-3'>
                                    {<UserRole role={UserRoles.VISITER} />}
                                    <span>viewer</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu> : (
                    <UserRole role={UserRoles[userRole!]} />
                )}
                <Button onClick={() => dispatch(onOpen(user))} className='w-fit bg-transparent' variant={'outline'}><Info className='w-4 h-4' /></Button>
                <Button disabled={isLoading} onClick={onBan} className={cn(`w-fit bg-transparent `, preview && 'hidden', isBanned ? 'hover:bg-green-500' : 'hover:bg-rose-500')} variant={'outline'}>
                    {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : (
                        <>
                            {!isBanned ? <Ban className='w-4 h-4' /> : <Check className='w-4 h-4' />}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default UserCard