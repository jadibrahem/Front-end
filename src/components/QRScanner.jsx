
import React from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
    const onScanSuccess = (decodedText, decodedResult) => {
        onScan(decodedText);  // Send the decoded text to the parent component or handle it here
    };

    const onScanFailure = (error) => {
        console.log("QR Code scan failed: ", error);
    };

    return (
        <Html5QrcodeScanner
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onScanSuccess}
            qrCodeErrorCallback={onScanFailure}
        />
    );
};

export default QRScanner;