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
                const  doctorAddress = publicToAddress(pubKeys[i])
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


export function dealWithDocument(deployedContract, myAccountAddress, doctors) {
    return async function (dispatch) {
        console.log(doctors)
        const secretKey = Math.random().toString(36).substring(7)
        console.log('random', secretKey)
        const secretKeys = {}
        Object.keys(doctors).forEach(async publicKey => secretKeys[publicKey] =  await EthCrypto.encryptWithPublicKey(publicKey, secretKey))
        console.log('secret keys', secretKeys)
        // try {
        //     
        //     const encryptedString = AES.encrypt(this.state.dataUrl, secretKey).toString()
        //     const decryptedString = AES.decrypt(encryptedString, secretKey).toString(enc.Utf8)
        //     console.log(decryptedString)
        //     ipfs.files.add(Buffer(encryptedString), (error, result) => {
        //       if (error) {
        //         console.log(error);
        //         return;
        //       }
        //       console.log("File added succesfully");
        //       console.log("IPFS result", result);

              
        
        //       storeFileHash(deployedContract, myAccountAddress, result[0].hash);
        //     });
        
        // } catch (e) {
        //     return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'EEEEEEE' })
        // }
    };
}

function storeFileHash(deployedContract, myAccountAddress, hash) {
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