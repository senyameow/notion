'use client'
import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'

const Footer = () => {
    return (
        <div className='z-50 flex flex-row items-center w-full p-6 bg-background justify-between dark:bg-dark'>
            <Logo />
            <div className='ml-auto flex items-center gap-2 '>
                <Button variant={'ghost'}>Privacy Policy</Button>
                <Button variant={'ghost'}>Terms & Conditions</Button>
            </div>
        </div>
    )
}

export default Footer