import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface settingsState {
    isOpen: boolean;
    userId: string | undefined
}

const initialState: settingsState = {
    isOpen: false,
    userId: undefined,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<string>) {
            state.isOpen = true
            state.userId = action.payload
        },
        onClose(state) {
            state.isOpen = false
            state.userId = undefined
        },
        onToggle(state) {
            state.isOpen = !state.isOpen
        }
    }
})

export default settingsSlice.reducer