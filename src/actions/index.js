import * as eUtil from 'ethereumjs-util'

export function getDoctors(deployedContract) {
    return async function (dispatch) {
        const pubKeys = await deployedContract.methods.returnDoctorsPubKeys().call()
        const doctors = {}
        for (let i = 0; i < pubKeys.length; i++) {
            const haveAccess = await deployedContract.methods.doesDoctorHaveAccess(pubKeys[i]).call()
            doctors[pubKeys[i]] = {haveAccess, address: eUtil.publicToAddress(Buffer.from(pubKeys[i], 'hex')).toString('hex')   }
        }
        console.log(doctors)
        return dispatch({type: 'SAVE_DOCTORS', payload: doctors})
    };
}

export function addDoctor(deployedContract, address, myAccountAddress) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.registerDoctor(address).estimateGas({from: myAccountAddress})
        deployedContract.methods.registerDoctor(address).send({gas: gasAmount, from: myAccountAddress}).once('receipt', (receipt)=> {
            return dispatch(getDoctors(deployedContract))
          })
    };
}

export function giveAccess(deployedContract, pubKey, myAccountAddress) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.grantAccessToDoctor(pubKey).estimateGas({from: myAccountAddress})
        deployedContract.methods.grantAccessToDoctor(pubKey).send({gas: gasAmount, from: myAccountAddress}).once('receipt', (receipt)=> {
            return dispatch({type: 'GIVE_ACCESS', pubKey } )
          })
    };
}

export function revokeAccess(deployedContract, pubKey, myAccountAddress) {
    return async function (dispatch) {
        const gasAmount = await deployedContract.methods.revokeAccessFromDoctor(pubKey).estimateGas({from: myAccountAddress})
        deployedContract.methods.revokeAccessFromDoctor(pubKey).send({gas: gasAmount, from: myAccountAddress}).once('receipt', (receipt)=> {
            return dispatch({type: 'REVOKE_ACCESS', pubKey } )
          })
    };
}