const initialState = {
    items: [
        {address: 'a', haveAccess: true},
        {address: 'b', haveAccess: false}
    ]
}

export const doctorsStore = (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_DOCTORS' : {
            return {
                accounts: action.payload
            }
        }
        default:
            return state
    }
}


