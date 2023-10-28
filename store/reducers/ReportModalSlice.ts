import { Doc, Id } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface reportModalState {
    isOpen: boolean;
    user: Doc<'users'> | undefined
    docId: Id<'documents'> | undefined
}

const initialState: reportModalState = {
    isOpen: false,
    user: undefined,
    docId: undefined
}

export type ReportModalPayload = {
    user: Doc<'users'> | undefined
    docId: Id<'documents'> | undefined
}

export const reportModalSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<ReportModalPayload>) {
            state.isOpen = true;
            state.docId = action.payload.docId;
            state.user = action.payload.user;
        },
        onClose(state) {
            state.isOpen = false;
            state.docId = undefined;
            state.user = undefined
        }
    }
})

export default reportModalSlice.reducer