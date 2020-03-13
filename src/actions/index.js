export function getDoctors(deployedContract, address) {
    return async function (dispatch) {
        const addresses = await deployedContract.methods.returnDoctorsAddresses().call()
        const doctors = {}
        for (let i = 0; i < addresses.length; i++) {
            const haveAccess = await deployedContract.methods.doesDoctorHaveAccess(addresses[i]).call()
            doctors[addresses[i]] = {haveAccess}
        }
        console.log(doctors)
        return dispatch({type: 'SAVE_DOCTORS', payload: doctors})
    };
}


export function addDoctor(deployedContract, address, myAccount) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.registerDoctor(address).estimateGas({from: myAccount})
        deployedContract.methods.registerDoctor(address).send({gas: gasAmount, from: myAccount}).once('receipt', (receipt)=> {
            return dispatch(getDoctors(deployedContract))
          })
    };
}

export function giveAccess(deployedContract, address, myAccount) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.grantAccessToDoctor(address).estimateGas({from: myAccount})
        deployedContract.methods.grantAccessToDoctor(address).send({gas: gasAmount, from: myAccount}).once('receipt', (receipt)=> {
            return dispatch({type: 'UPDATE_DOCTOR_STATUS', payload: {address, props: {haveAccess: true} } } )
          })
    };
}

export function revokeAccess(deployedContract, address, myAccount) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.revokeAccessFromDoctor(address).estimateGas({from: myAccount})
        deployedContract.methods.revokeAccessFromDoctor(address).send({gas: gasAmount, from: myAccount}).once('receipt', (receipt)=> {
            return dispatch({type: 'UPDATE_DOCTOR_STATUS', payload: {address, props: {haveAccess: false} } } )
          })
    };
}