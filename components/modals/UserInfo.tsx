'use client'
import React, { useEffect, useRef, useState } from 'react'
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
import { ScrollArea } from '../ui/scroll-area'
import { useIntersection } from '@mantine/hooks';
import { Doc } from '@/convex/_generated/dataModel'


const UserInfoModal = () => {

    const { isOpen, user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const { onClose } = userModalSlice.actions

    const [docs, setDocs] = useState<Doc<'documents'>[]>([])

    const [fetchId, setFetchId] = useState<string | undefined>()

    useEffect(() => {
        setFetchId(user?.userId)
    }, [user])

    console.log(fetchId)

    let { results, status, loadMore, isLoading } = usePaginatedQuery(
        api.documents.UsersDoc,
        { userId: fetchId },
        { initialNumItems: 8 },
    );

    const onCloseModal = () => {
        dispatch(onClose())
        setDocs([])
    }

    const lastRowRef = useRef<HTMLElement>(null)

    const { ref, entry } = useIntersection({
        root: lastRowRef.current,
        threshold: 1
    })


    useEffect(() => {
        if (!isLoading) {
            setDocs(results)
        }
    }, [results, isLoading])

    useEffect(() => {
        if (entry?.isIntersecting) {
            loadMore(4)
        }
    }, [entry])

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className='min-w-[600px]'>
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
                    <ScrollArea className='h-[250px] w-full py-4'>
                        <div onClick={() => dispatch(onClose())} className='w-full grid grid-cols-2 gap-4'>
                            {docs.map((doc, ind) => {
                                if (ind === results.length - 1 || ind === results.length - 2 || ind === results.length - 3 || ind === results.length - 4) {
                                    return (
                                        <div className='w-full h-full border min-h-[100px]' ref={ref} key={doc._id}>
                                            <DocCard isLoading={isLoading} doc={doc} />
                                        </div>
                                    )
                                } else {
                                    return (
                                        <DocCard key={doc._id} doc={doc} />
                                    )
                                }

                            })}
                        </div>
                    </ScrollArea>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default UserInfoModal