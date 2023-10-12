'use client'
import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/ui/ModToggle'
import { useConvexAuth } from "convex/react";

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Loader2 } from 'lucide-react'
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Link from 'next/link'


const Navbar = () => {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const isScrolled = useScrollTop()
    return (
        <nav className={cn(`px-4 flex bg-white dark:bg-dark w-full pr-6 relative z-30`)}>
            <div className={cn(`h-full w-full flex items-center justify-between transition duration-500 border-b-black/0`, isScrolled && 'border-b-2 border-b-black/60')}>
                <Logo />
                <div className='flex items-center gap-2 h-fit'>
                    {!isAuthenticated && <Button className='h-fit py-1' variant={'ghost'}>Request a demo</Button>}
                    <Separator orientation='vertical' className='w-[1px] h-[20px]' />
                    {isLoading && (
                        <Loader2 className='animate-spin' />
                    )}
                    {!isAuthenticated && !isLoading && (
                        <>
                            <SignInButton mode={'redirect'}>Log In</SignInButton>
                        </>
                    )}
                    <ModeToggle />

                    {isAuthenticated && (
                        <div className='flex items-center gap-1'>
                            <Link href={'/docs'}>
                                <Button variant={'ghost'}>
                                    Enter Notion
                                </Button>
                            </Link>
                            <UserButton afterSignOutUrl='/' />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar