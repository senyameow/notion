import React from 'react'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const font = Poppins({
    weight: ['400', '600'],
    subsets: ['latin']
})

const Logo = () => {
    return (
        <div className={`hidden md:flex items-center gap-2`}>
            <Image src={'/logo.svg'} alt='Logo' width={40} height={40} />
            <p className={cn(`font-semibold`, font.className)}>Notion</p>
        </div>
    )
}

export default Logo