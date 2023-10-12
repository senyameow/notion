import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const Heading = () => {
    return (
        <div className='max-w-3xl space-y-4 text-center'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold'>
                Your Ideas, Documents, & Plans. Unified. Welcome to <span className='underline'>Notion</span>
            </h1>
            <h3 className='text-xl  md:text-2xl max-w-[80%] text-center mx-auto font-medium'>
                Notion is the connected workspace where
                better, faster work happens. Now with AI
            </h3>
            <Button className='font-semibold gap-2'>
                Get Notion Free
                <ArrowRight className='text-white dark:text-black font-bold w-4 h-4' />
            </Button>
        </div>
    )
}

export default Heading