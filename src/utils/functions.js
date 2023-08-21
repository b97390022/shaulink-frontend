import { nanoid } from 'nanoid';

const downloadQRCode = (canvas, qrValue) => {
    const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrValue.split('/').pop()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

function createShortId() {
    return nanoid(6);
}
export {
    downloadQRCode,
    createShortId
}