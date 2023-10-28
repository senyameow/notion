import { Doc, Id } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface reportModalState {
    isOpen: boolean;
    userId: string | undefined
    docId: Id<'documents'> | undefined
}

const initialState: reportModalState = {
    isOpen: false,
    userId: undefined,
    docId: undefined
}

export type ReportModalPayload = {
    userId: string | undefined
    docId: Id<'documents'> | undefined
}

export const reportModalSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<ReportModalPayload>) {
            state.isOpen = true;
            state.docId = action.payload.docId;
            state.userId = action.payload.userId;
        },
        onClose(state) {
            state.isOpen = false;
            state.docId = undefined;
            state.userId = undefined
        }
    }
})

export default reportModalSlice.reducer