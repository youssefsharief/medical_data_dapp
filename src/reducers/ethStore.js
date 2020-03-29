const initialState = {deployedContract:undefined, account: undefined, totalNumber:undefined, items: undefined,  }

export const ethStore = (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_ACCOUNTS' : {
            return {
                accounts: action.payload.accounts
            }
        }
        case 'SET_ETH_STATE': {
            return { ...state, deployedContract: action.payload.deployedContract, account: action.payload.account }
        }
        default:
            return state
    }
}




