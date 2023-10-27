import { Doc } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userModalState {
    user: Doc<'users'> | undefined;
    isOpen: boolean
}

const initialState: userModalState = {
    user: undefined,
    isOpen: false
}

export const userModalSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<Doc<'users'>>) {
            state.user = action.payload;
            state.isOpen = true
        },
        onClose(state) {
            state.user = undefined;
            state.isOpen = false
        }
    }
})

export default userModalSlice.reducer