'use client'

import React from 'react'
import { useConvexAuth } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import Navbar from './_components/Navbar'
import SearchCommand from './_components/SearchCommand'

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
        <div className='h-full dark:bg-dark flex'>
            <Navbar />
            <main className='h-full flex-1 overflow-hidden'>
                <SearchCommand />
                {children}
            </main>
        </div>
    )
}

export default layout