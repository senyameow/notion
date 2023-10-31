import { Doc } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface adminRoleModalState {
    isOpen: boolean;
    user: Doc<'users'> | null;
    doc: Doc<'documents'> | null;
}

const initialState: adminRoleModalState = {
    isOpen: false,
    user: null,
    doc: null
}

interface adminRoleModalStatePayload {
    user: Doc<'users'>;
    doc: Doc<'documents'>;
}

export const adminRoleModalSlice = createSlice({
    name: 'adminRoleModal',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<adminRoleModalStatePayload>) {
            state.isOpen = true;
            state.doc = action.payload.doc;
            state.user = action.payload.user;
        },
        onClose(state) {
            state.isOpen = false;
            state.doc = null;
            state.user = null;
        }
    }
})

export default adminRoleModalSlice.reducer