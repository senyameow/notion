'use client'
import { Doc } from '@/convex/_generated/dataModel'
import Image from 'next/image'
import React from 'react'

interface UserCardProps {
    user: Doc<'users'>
}

const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="w-full p-3 group border cursor-pointer">
            <div className="flex items-center w-full justify-between">
                <div className='flex items-center gap-2'>
                    <Image src={user.image_url} alt='user image' width={30} height={30} className='rounded-full ' />
                    <span>{user.name}</span>
                </div>
            </div>
        </div>
    )
}

export default UserCard