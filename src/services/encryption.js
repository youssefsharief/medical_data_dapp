import { AES, enc } from 'crypto-js';
import * as  EthCrypto from 'eth-crypto';

export function decryptSymmtrically(encryptedFile, secretKey) {
    return AES.decrypt(encryptedFile, secretKey).toString(enc.Utf8)
}

export function encryptSymmtrically(dataUrl, secretKey) {
    return AES.encrypt(dataUrl, secretKey).toString()
}

export function encryptASymmtrically(publicKey, secretKey) {
    return EthCrypto.encryptWithPublicKey(publicKey, secretKey)
}
