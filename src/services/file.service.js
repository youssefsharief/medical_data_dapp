import { decryptSymmtrically } from "./encryption";
import { fetchFile } from "./api.service";

export async function getFile(fileHash, secretKey) {
    const encryptedFile = await fetchFile(fileHash)
    download(decryptSymmtrically(encryptedFile, secretKey))
}

function download(url) {
    fetch(url).then(function (t) {
        return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", 'data');
            a.click();
        }
        );
    });
}