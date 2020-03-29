import { userType } from '../types/userType';
import { publicToAddress } from '../services/ethUtils';
import { AES, enc } from 'crypto-js';
import * as  EthCrypto from 'eth-crypto';

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
                console.log(myAccountAddress)
                console.log(doctorAddress)
                doctors[pubKeys[i]] = { haveAccess, address: doctorAddress }
                if (doctorAddress === myAccountAddress) {
                    console.log('I am a doctor')
                    dispatch({ type: 'SET_IDENTITY', payload: doctors[pubKeys[i]].haveAccess ? userType.DOCTOR_WITH_ACCESS : userType.DOCTOR_WITHOUT_ACCESS })
                } else {
                    console.log('I am not a doctor')
                }
            }
            console.log(doctors)
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
            console.log('isOwner', isOwner)
            if (isOwner) {
                console.log('looks like I am the owner')
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


export function dealWithDocument(deployedContract, myAccountAddress, doctors, dataUrl) {
    return async function (dispatch) {
        console.log(doctors)
        const secretKey = Math.random().toString(36).substring(10)
        console.log('random', secretKey)
        const encryptedFileAsString = AES.encrypt(dataUrl, secretKey).toString()
        // const decryptedString = AES.decrypt(encryptedFileAsString, secretKey).toString(enc.Utf8)
        // console.log(decryptedString)
        ipfs.files.add(Buffer(encryptedFileAsString), (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("File added succesfully");
            console.log("IPFS result", result);
            dispatch(storeFileHash(deployedContract, myAccountAddress, result[0].hash));
        });
        
        const ecryptedSecretsArr = await Promise.all(Object.keys(doctors).map(async publicKey => EthCrypto.encryptWithPublicKey(publicKey, secretKey)))
        const secretKeys = Object.keys(doctors).reduce((obj, k, i) => ({...obj, [k]: ecryptedSecretsArr[i] }), {})

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