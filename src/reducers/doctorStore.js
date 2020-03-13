import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    items: {}
}

export const doctorsStore = createReducer(initialState, {
    UPDATE_DOCTOR_STATUS: (state, action) => {
      state.items[action.payload.address] = action.payload.props
    },
    SAVE_DOCTORS : (state, action) => {
        state.items= action.payload
    }
})