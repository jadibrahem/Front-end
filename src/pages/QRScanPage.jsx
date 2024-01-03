import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { Container, Row, Col, Button, ButtonGroup, Alert } from 'reactstrap';

const QRScanPage = () => {
  const [result, setResult] = useState('');
  const [scanType, setScanType] = useState('time_in');
  const [alertColor, setAlertColor] = useState('success');
  const [isScanning, setIsScanning] = useState(true); // State to control scanning

  const handleScan = async (data) => {
    if (data) {
      setIsScanning(false); // Pause scanning after a scan
      setResult('Scanning...');
      setAlertColor('secondary');

      try {
        const response = await fetch('http://localhost:8000/scan-qr-code/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ InsuranceNumber: data, ScanType: scanType }),
        });

        const responseData = await response.json();

        if (responseData.status === 'success') {
          setResult(`Attendance recorded successfully. ID: ${responseData.attendance_id}`);
          setAlertColor('success');
        } else {
          setResult(`Error: ${responseData.message}`);
          setAlertColor('danger');
        }
      } catch (error) {
        console.error('Error recording attendance:', error);
        setResult('Error recording attendance. Please try again.');
        setAlertColor('danger');
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
    setResult('Error scanning QR code. Please check your camera permissions.');
    setAlertColor('danger');
    setIsScanning(false);
  };

  const handleResumeScan = () => {
    setIsScanning(true); // Resume scanning on user confirmation
    setResult(''); // Clear result
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1>Scan QR Code for Attendance</h1>
          <ButtonGroup>
            <Button 
              color={scanType === 'time_in' ? 'primary' : 'secondary'}
              onClick={() => setScanType('time_in')}
            >
              Time In
            </Button>
            <Button 
              color={scanType === 'time_out' ? 'primary' : 'secondary'}
              onClick={() => setScanType('time_out')}
            >
              Time Out
            </Button>
          </ButtonGroup>
          {isScanning ? (
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', marginTop: '20px' }}
            />
          ) : (
            <Button color="info" onClick={handleResumeScan} style={{ marginTop: '20px' }}>
              Scan Again
            </Button>
          )}
          {result && (
            <Alert color={alertColor} style={{ marginTop: '20px' }}>
              {result}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QRScanPage;