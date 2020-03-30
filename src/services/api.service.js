export function fetchFile(fileHash) {
    return fetch(`https://ipfs.infura.io/ipfs/${fileHash}`).then(res => res.text())
}

export function fetchSecretObject(secretObjectHash) {
    return fetch(`https://ipfs.infura.io/ipfs/${secretObjectHash}`).then(res => res.clone().json())
}