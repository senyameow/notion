import { createSlice } from "@reduxjs/toolkit";

interface settingsState {
    isOpen: boolean;
}

const initialState: settingsState = {
    isOpen: false,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        onOpen(state) {
            state.isOpen = true
        },
        onClose(state) {
            state.isOpen = false
        },
        onToggle(state) {
            state.isOpen = !state.isOpen
        },
    }
})

export default settingsSlice.reducer