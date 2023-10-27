import { Doc } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface settingsState {
    user: Doc<'users'> | undefined
}

const initialState: settingsState = {
    user: undefined,
}

export const settingsSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<Doc<'users'>>) {
            state.user = action.payload
        },
        onClose(state) {
            state.user = undefined
        }
    }
})

export default settingsSlice.reducer