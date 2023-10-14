'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { toast } from 'sonner'

const Empty = () => {

    const onCreate = async () => {
        try {
            //...
            toast.success(`you've created a new document`)
        } catch (error) {

        }
    }

    const { user } = useUser()
    return (
        <div className='max-w-3xl mx-auto'>
            <div className='flex flex-col items-center'>
                <div className='relative w-[250px] sm:w-[300px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[350px]'>
                    <Image src={'/empty-dark.png'} alt='create' className='object-contain dark:block hidden' fill />
                    <Image src={'/empty.png'} alt='create' className='object-contain block dark:hidden' fill />
                </div>
                <div className='flex flex-col items-center space-y-5'>
                    <h2 className='font-bold text-xl sm:text-2xl'>Welcome To {user?.firstName}'s Notion</h2>
                    <Button onClick={onCreate}>
                        <PlusCircle className='w-5 h-5 mr-2' />
                        Create a note
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Empty