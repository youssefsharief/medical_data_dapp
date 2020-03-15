import * as eUtil from 'ethereumjs-util'

export function getDoctors(deployedContract, myAccountAddress) {
    console.log('myAccountAddress', myAccountAddress)
    return async function (dispatch) {
        try {
            const pubKeys = await deployedContract.methods.returnDoctorsPubKeys().call({ from: myAccountAddress })
            const doctors = {}
            for (let i = 0; i < pubKeys.length; i++) {
                const haveAccess = await deployedContract.methods.doesDoctorHaveAccess(pubKeys[i]).call({ from: myAccountAddress })
                doctors[pubKeys[i]] = { haveAccess, address: eUtil.publicToAddress(Buffer.from(pubKeys[i], 'hex')).toString('hex') }
            }
            console.log(doctors)
            return dispatch({ type: 'SAVE_DOCTORS', payload: doctors })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get the doctors' })
        }

    };
}

export function addDoctor(deployedContract, doctorPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.registerDoctor(doctorPubKey).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.registerDoctor(doctorPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch(getDoctors(deployedContract, myAccountAddress))
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t add a doctor. Make sure you are the owner of the contract' })
        }
    };
}

export function giveAccess(deployedContract, doctorPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.grantAccessToDoctor(doctorPubKey).estimateGas({ from: myAccountAddress })
            deployedContract.methods.grantAccessToDoctor(doctorPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'GIVE_ACCESS', pubKey: doctorPubKey })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t give access to a doctor. Make sure you are the owner of the contract' })
        }
    };
}

export function revokeAccess(deployedContract, doctorPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.revokeAccessFromDoctor(doctorPubKey).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.revokeAccessFromDoctor(doctorPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'REVOKE_ACCESS', pubKey: doctorPubKey })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t revoke access from a doctor. Make sure you are the owner of the contract' })
        }
    };
}

export function storeFileHash(deployedContract, myAccountAddress, hash) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.storeFileHash(hash).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.storeFileHash(hash).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'STORE_FILE_HASH', hash })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store your document hash in the smart contract. Make sure you are the owner' })
        }
    };
}


export function getFileHash(deployedContract) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getFileHash().call()
            if (hash) {
                dispatch({ type: 'STORE_FILE_HASH', hash })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your document\'s hash. Make sure you are the owner' })
        }
    };
}