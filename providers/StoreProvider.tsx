'use client'
import { setupStore } from '@/store/store'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

const StoreProvider = ({ children }: PropsWithChildren) => {

    const store = setupStore()

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreProvider