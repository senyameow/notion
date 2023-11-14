'use client'
import SearchCommand from '@/app/(main)/(routes)/_components/SearchCommand'
import SettingsCommand from '@/app/(main)/(routes)/_components/SettingsCommand'
import ImageUploadModal from '@/components/modals/ImageUploadModal'
import UserInfoModal from '@/components/modals/UserInfo'
import React, { useEffect, useState } from 'react'

const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <SearchCommand />
            <ImageUploadModal />
            <UserInfoModal />
        </>
    )
}

export default ModalProvider