'use client'

import React from 'react'
import { useConvexAuth } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import Navbar from './_components/Navbar'
import ModalProvider from '@/providers/ModalProvider'

const layout = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }

    if (!isAuthenticated) return redirect('/')

    return (
        <div className='h-full scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-700 dark:bg-dark flex overflow-x-hidden'>
            <Navbar />
            <main className='h-full flex-1 overflow-hidden'>
                <ModalProvider />
                {children}
            </main>
        </div>
    )
}

export default layout