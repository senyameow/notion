import Image from 'next/image'
import React from 'react'

const Heroes = () => {
    return (
        <div className='flex flex-row gap-3 items-center'>
            <div className='relative w-[300px] sm:w-[350px] h-[300px] sm:h-[350px] md:w-[400px] md:h-[400px]'>
                <Image src={'/documents.png'} alt='' fill className='object-contain dark:hidden block' />
                <Image src={'/documents-dark.png'} alt='' fill className='object-contain dark:block hidden' />
            </div>
            <div className='relative w-[300px] sm:w-[350px] h-[300px] sm:h-[350px] md:w-[400px] md:h-[400px] hidden md:block'>
                <Image src={'/reading.png'} alt='' fill className='object-contain dark:hidden block' />
                <Image src={'/reading-dark.png'} alt='' fill className='object-contain dark:block hidden' />
            </div>
        </div>
    )
}

export default Heroes