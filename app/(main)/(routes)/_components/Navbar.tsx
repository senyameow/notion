'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronsLeft, LucideChevronLeft, Menu } from 'lucide-react'
import React, { ElementRef, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

const Navbar = () => {

    const isMobile = useMediaQuery('(max-width: 768px)')

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        isResizingRef.current = true // пока хз зачем реф, а не стейт, посмотрим, что будет

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current) return
            let newWidth = e.clientX
            if (newWidth < 240) newWidth = 240
            if (newWidth > 480) newWidth = 480

            if (sidebarRef.current && navbarRef.current) {
                sidebarRef.current.style.width = `${newWidth}px`
                navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
                navbarRef.current.style.setProperty('left', `${newWidth}px`)
            }
        }

        const handleMouseUp = () => {
            isResizingRef.current = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

    }

    const resetWidth = () => {
        setIsResetting(true)
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = isMobile ? '100%' : '240px' // на мобилке хотим на фулскрин открыть, а так просто 240px (начальная ширина)
            navbarRef.current.style.setProperty('width', isMobile ? `0` : 'calc(100% - 240px)')
            navbarRef.current.style.setProperty('left', isMobile ? '0' : '240px')
        }
        setTimeout(() => {
            setIsResetting(false)
        }, 300);
        setIsCollapsed(false)
    }
    const collapse = () => {
        setIsCollapsed(true)
        setIsResetting(true)
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = '0px'
            navbarRef.current.style.setProperty('width', isMobile ? `0` : '100%')
            navbarRef.current.style.setProperty('left', '0')
        }
        setTimeout(() => {
            setIsResetting(false)
        }, 300);
        setIsCollapsed(true)
    }

    console.log(isCollapsed)

    return (
        <>
            <aside ref={sidebarRef} className={cn(`w-60 bg-secondary overflow-y-auto flex flex-col z-[99999] group/sidebar relative h-full `, isMobile && 'w-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')}>
                <div onClick={collapse} className={cn(`absolute hover:bg-neutral-400 dark:hover:text-dark flex items-center justify-center w-6 h-6 rounded-lg top-3 right-4 hover cursor-pointer text-neutral-400 opacity-0 group-hover/sidebar:opacity-100 transition hover:bg-opacity-40`, isMobile && 'opacity-100')}>
                    <ChevronsLeft className='w-5 h-5' />
                </div>
                <div>
                    <p>actions</p>
                </div>
                <div>
                    <p>docs</p>
                </div>
                <div onMouseDown={handleMouseDown} onClick={resetWidth} className='group-hover/sidebar:opacity-100 opacity-0 cursor-ew-resize w-1 bg-primary/10 transition h-full absolute right-0 top-0' />
            </aside>
            <div className={cn(` w-[calc(100%-240px)] left-60 absolute top-0 z-[99999] bg-white`, isMobile && 'w-full left-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')} ref={navbarRef}>
                <nav className=' px-3 py-4 w-full'>
                    <button onClick={resetWidth} className={cn(`w-fit h-fit p-2 hover:bg-transparent`)}>
                        <Menu className={cn(`w-6 h-6 text-black opacity-0`, isCollapsed && 'opacity-100')} />
                    </button>
                </nav>
            </div>
        </>
    )
}

export default Navbar