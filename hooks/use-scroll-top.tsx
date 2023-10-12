
import { useState, useEffect } from 'react'

export const useScrollTop = (start = 15) => {
    const [isScrolled, setIsScrolled] = useState(false)

    const onScroll = () => {
        if (window.scrollY > start) {
            setIsScrolled(true)
        } else {
            setIsScrolled(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll)

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [start])

    return isScrolled
} 