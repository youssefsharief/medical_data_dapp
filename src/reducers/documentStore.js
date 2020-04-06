import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    fileHash: undefined,
    secretObjectHash: undefined,
    myEncryptedSecretKey: undefined
}

export const documentStore = createReducer(initialState, {
    STORE_FILE_HASH: (state, action) => {
        state.fileHash = action.hash
    },
    STORE_SECRET_OBJECT_HASH: (state, action) => {
        state.secretObjectHash = action.hash
    },
    STORE_ENCRYPTED_SECRET_KEY: (state, action) => {
        state.myEncryptedSecretKey = action.payload
    },
    RESET_DOCUMENT_STORE: (state, action) => {
        state.fileHash = undefined
        state.secretObjectHash = undefined
        state.myEncryptedSecretKey = undefined
    },
})