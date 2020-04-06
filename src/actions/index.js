import { userType } from '../types/userType';
import { publicToAddress } from '../services/ethUtils';
import { fetchSecretObject } from '../services/api.service';
import { encryptSymmtrically, encryptASymmtrically } from '../services/encryption';

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

export function getDoctors(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const pubKeys = await deployedContract.methods.returnDoctorsPubKeys().call({ from: myAccountAddress })
            const doctors = {}
            for (let i = 0; i < pubKeys.length; i++) {
                const haveAccess = await deployedContract.methods.doesDoctorHaveAccess(pubKeys[i]).call({ from: myAccountAddress })
                const doctorAddress = publicToAddress(pubKeys[i])
                doctors[pubKeys[i]] = { haveAccess, address: doctorAddress }
                if (doctorAddress === myAccountAddress) {
                    dispatch({ type: 'SET_IDENTITY', payload: doctors[pubKeys[i]].haveAccess ? userType.DOCTOR_WITH_ACCESS : userType.DOCTOR_WITHOUT_ACCESS })
                }
            }
            return dispatch({ type: 'SAVE_DOCTORS', payload: doctors })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get the doctors' })
        }
    };
}


export function amIOwner(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const isOwner = await deployedContract.methods.amIOwner().call({ from: myAccountAddress })
            if (isOwner) {
                dispatch({ type: 'SET_IDENTITY', payload: userType.OWNER })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'No Idea why the amIOwner method is not working' })
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
            await deployedContract.methods.grantAccessToDoctor(doctorPubKey).send({ gas: gasAmount, from: myAccountAddress })
            dispatch({ type: 'GIVE_ACCESS', pubKey: doctorPubKey })
            return  dispatch({ type: 'RESET_DOCUMENT_STORE' })
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
            dispatch({ type: 'REVOKE_ACCESS', pubKey: doctorPubKey })
            return  dispatch({ type: 'RESET_DOCUMENT_STORE' })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t revoke access from a doctor. Make sure you are the owner of the contract' })
        }
    };
}


export function dealWithDocument(deployedContract, myAccountAddress, doctors, dataUrl) {
    return async function (dispatch) {
        const secretKey = Math.random().toString(36).substring(2)
        const encryptedFileAsString = encryptSymmtrically(dataUrl, secretKey)
        ipfs.files.add(Buffer(encryptedFileAsString), (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("File added succesfully");
            console.log("IPFS result", result);
            dispatch(storeFileHash(deployedContract, myAccountAddress, result[0].hash));
        });

        const ecryptedSecretsArr = await Promise.all(Object.keys(doctors).map(async publicKey => encryptASymmtrically(publicKey, secretKey)))
        const secretKeys = Object.keys(doctors).reduce((obj, k, i) => ({ ...obj, [k]: ecryptedSecretsArr[i] }), {})

        console.log('resolved', ecryptedSecretsArr)
        console.log('secret keys', secretKeys)


        const stringifiedSecretKeys = JSON.stringify(secretKeys)
        console.log('stringifiedSecretKeys', stringifiedSecretKeys)
        ipfs.files.add(Buffer(stringifiedSecretKeys), (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("Secret Object added succesfully");
            console.log("IPFS result", result);
            dispatch(storeSecretObjectHash(deployedContract, myAccountAddress, result[0].hash));
        });
    };
}

function storeFileHash(deployedContract, myAccountAddress, hash) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.storeFileHash(hash).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.storeFileHash(hash).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'STORE_FILE_HASH', hash })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store your document hash in the smart contract' })
        }
    };
}


function storeSecretObjectHash(deployedContract, myAccountAddress, hash) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.storeSecretObjectHash(hash).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.storeSecretObjectHash(hash).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'STORE_SECRET_OBJECT_HASH', hash })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store your secret object hash in the smart contract' })
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
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your document\'s hash' })
        }
    };
}

export function getSecretObjectHash(deployedContract) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getSecretObjectHash().call()
            if (hash) {
                dispatch({ type: 'STORE_SECRET_OBJECT_HASH', hash })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your secret object hash' })
        }
    };
}

export function showMyEncryptedSecret(hash, myAccountAddress) {
    return async function (dispatch) {
        try {
            const secretObject = await fetchSecretObject(hash)
            const myEncryptedSecret = getMyEncryptedSecret(myAccountAddress, secretObject)
            if (myEncryptedSecret) {
                dispatch({ type: 'STORE_ENCRYPTED_SECRET_KEY', payload: JSON.stringify(myEncryptedSecret) })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your secret object hash' })
        }
    };
}




function getMyEncryptedSecret(myAccountAddress, secretObject) {
    for (const key in secretObject) {
        if (publicToAddress(key) === myAccountAddress) {
            return secretObject[key]
        }
    }
}

