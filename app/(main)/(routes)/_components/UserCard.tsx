'use client'
import { Button } from '@/components/ui/button'
import { Doc } from '@/convex/_generated/dataModel'
import { Ban, Info } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface UserCardProps {
    user: Doc<'users'>
}

const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="w-full p-3 group border cursor-pointer relative">
            <div className="flex items-center w-full justify-between">
                <div className='flex items-center gap-2'>
                    <Image src={user.image_url} alt='user image' width={30} height={30} className='rounded-full ' />
                    <span>{user.name}</span>
                </div>
            </div>
            <div className='flex items-center gap-2 absolute top-2 right-3'>
                <Button className='w-fit bg-transparent' variant={'outline'}><Info className='w-4 h-4' /></Button>
                <Button className='w-fit bg-transparent' variant={'outline'}><Ban className='w-4 h-4' /></Button>
            </div>
        </div>
    )
}

export default UserCard