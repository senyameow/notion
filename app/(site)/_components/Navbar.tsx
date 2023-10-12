'use client'
import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'

const Navbar = () => {
    const isScrolled = useScrollTop()
    return (
        <nav className={cn(`px-4 flex  bg-white w-full pr-6 `)}>
            <div className={cn(`h-full w-full flex items-center justify-between transition duration-500 border-b-black/0`, isScrolled && 'border-b-2 border-b-black/60')}>
                <Logo />
                <div className='flex items-center gap-2 h-fit'>
                    <Button className='h-fit py-1' variant={'ghost'}>Request a demo</Button>
                    <Separator orientation='vertical' className='w-[1px] h-[20px]' />
                    <Button className='h-fit py-1' variant={'ghost'}>Log In</Button>
                    <Button className='h-fit py-1'>Get Notion Free</Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar