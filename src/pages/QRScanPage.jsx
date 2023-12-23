import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

const QRScanPage = () => {
  const [result, setResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await fetch('http://127.0.0.1:8000/scan-qr-code/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ InsuranceNumber: data }),
        });

        const responseData = await response.json();

        if (responseData.status === 'success') {
          setResult(`Attendance recorded successfully. ID: ${responseData.attendance_id}`);
        } else {
          setResult(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error('Error recording attendance:', error);
        setResult('Error recording attendance. Please try again.');
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
    setResult('Error scanning QR code. Please check your camera permissions.');
  };

  return (
    <div>
      <h1>Scan QR Code for Attendance</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {result && <p>{result}</p>}
    </div>
  );
};

export default QRScanPage;