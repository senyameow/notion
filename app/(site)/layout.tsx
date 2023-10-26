'use client'
import React from 'react'
import Navbar from './_components/Navbar'
import useStoreUserEffect from '@/hooks/use-store-user'

const layout = ({ children }: { children: React.ReactNode }) => {
    useStoreUserEffect()
    return (
        <div className='h-full'>
            <div className='h-12 flex inset-y-0 fixed z-50 w-full'>
                <Navbar />
            </div>
            <main className='pt-12'>
                {children}
            </main>
        </div>
    )
}

export default layout