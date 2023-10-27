'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { userModalSlice } from '@/store/reducers/UserModalSlice'
import Image from 'next/image'
import { format } from 'date-fns'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'
import DocCard from '@/app/(main)/(routes)/_components/DocCard'
import { Skeleton } from '../ui/skeleton'

const UserInfoModal = () => {

    const { isOpen, user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const { onClose } = userModalSlice.actions

    const { results, status, loadMore, isLoading } = usePaginatedQuery(
        api.documents.UsersDoc,
        { userId: user?.userId! },
        { initialNumItems: 4 }
    );

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='py-4'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-4'>
                                <Image src={user?.image_url!} alt='user image' width={30} height={30} className='rounded-full' />
                                <div className='text-xl font-bold'>{user?.name}</div>
                            </div>
                            <div className='flex flex-row gap-2 items-center'>
                                <span className='text-xs text-neutral-500'>joined notion: </span>
                                {user?._creationTime && <span className='text-sm '>{format(user?._creationTime!, 'dd MMMM yyyy')}</span>}
                            </div>
                        </div>
                    </DialogTitle>
                    <h2 className='text-sm'>{user?.name}'s <span className='underline'>notes</span>: </h2>
                    {!isLoading ? <div className='w-full grid grid-cols-2'>
                        {results.map(doc => (
                            <DocCard key={doc._id} doc={doc} />
                        ))}
                    </div> : (
                        <div className='w-full h-full'>
                            <Skeleton className='w-[100px] h-[50px]' />
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default UserInfoModal