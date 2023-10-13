'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronsLeft, LucideChevronLeft } from 'lucide-react'
import React, { ElementRef, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

const Navbar = () => {

    const isMobile = useMediaQuery('(max-width: 768px)')

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isResetting, setIsResetting] = useState(false)


    return (
        <>
            <aside ref={sidebarRef} className={cn(`w-60 bg-secondary overflow-y-auto flex flex-col z-[99999] group/sidebar relative h-full`, isMobile && 'w-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')}>
                <div className={cn(`absolute hover:bg-neutral-400 dark:hover:text-dark flex items-center justify-center w-6 h-6 rounded-lg top-3 right-4 hover cursor-pointer text-neutral-400 opacity-0 group-hover/sidebar:opacity-100 transition hover:bg-opacity-40`, isMobile && 'opacity-100')}>
                    <ChevronsLeft className='w-5 h-5' />
                </div>
                <div>
                    <p>actions</p>
                </div>
                <div>
                    <p>docs</p>
                </div>
                <div className='group-hover/sidebar:opacity-100 opacity-0 cursor-ew-resize w-1 bg-primary/10 transition h-full absolute right-0 top-0' />
            </aside>
            <div className={cn(` w-[calc(100%-240px)] left-60 absolute top-0 z-[99999]`, isMobile && 'w-full left-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')} ref={navbarRef}>

            </div>
        </>
    )
}

export default Navbar