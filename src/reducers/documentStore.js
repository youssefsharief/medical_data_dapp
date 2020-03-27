import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    hash: undefined
}

export const documentStore = createReducer(initialState, {
    STORE_FILE_HASH: (state, action) => {
        state.hash = action.hash
    },
})