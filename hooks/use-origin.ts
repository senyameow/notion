'use client'

import { useEffect, useState } from "react"

export const useOrigin = () => {

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return ''

    const origin = typeof window.location.origin !== 'undefined' && window.location.origin ? window.location.origin : ''

    return origin
}