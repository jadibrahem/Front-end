import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const QRCodePage = () => {
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [error, setError] = useState('');
  const { insuranceNumber } = useParams();

  useEffect(() => {
    // Fetch QR code image from the backend
    fetch(`https://halotrust.pythonanywhere.com/qr-code/${insuranceNumber}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch QR code: ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setQRCodeImage(imageUrl);
      })
      .catch((error) => {
        setError('Failed to fetch QR code');
        console.error('Error fetching QR code:', error);
      });
  }, [insuranceNumber]);

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>Your QR Code</h1>
      {qrCodeImage ? (
        <img src={qrCodeImage} alt="QR Code" />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodePage;