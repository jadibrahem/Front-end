import React, { useRef, useState } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Col,
  Alert
} from 'reactstrap';
import { RemoteUrl } from '../instant';

const LeaveRequestForm = () => {
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [leaveType, setLeaveType] = useState('paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const sigCanvas = useRef({});
  const [error] = useState(null);
  // Clears the signature canvas
  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData(null);
  };

  // Saves the signature to the state
  const saveSignature = () => {
    setSignatureData(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  // Converts the signature dataURL to a blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  };

  // Handles the form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object to send data as multipart/form-data
    const formData = new FormData();
    formData.append('InsuranceNumber', insuranceNumber);
    formData.append('LeaveType', leaveType);
    formData.append('StartDate', startDate);
    formData.append('EndDate', endDate);
    formData.append('Reason', reason);

    // Convert the signatureData to a Blob and append as a file if it exists
    if (signatureData) {
        const signatureBlob = dataURLtoBlob(signatureData);
        formData.append('signature_file', signatureBlob, 'signature.png');  
    }

    // Submit the form data to the backend
    axios({
      method: 'post',
      url: `${RemoteUrl}/leave-request/`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      // Handle success
      console.log(response);
    })
    .catch(error => {
      // Handle error
      console.error('Error submitting form:', error);
    });
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Leave Request Form / نموذج طلب إجازة</CardTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup row>
            <Label for="insuranceNumber" sm={2}>
              Insurance Number / رقم التأمين:
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="insuranceNumber"
                id="insuranceNumber"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="leaveType" sm={2}>
              Leave Type / نوع الإجازة:
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="leaveType"
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="paid">Paid / مدفوعة</option>
                <option value="unpaid">Unpaid / غير مدفوعة</option>
                <option value="sick">Sick Leave / إجازة مرضية</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="startDate" sm={2}>
              Start Date / تاريخ البدء:
            </Label>
            <Col sm={10}>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="endDate" sm={2}>
              End Date / تاريخ الانتهاء:
            </Label>
            <Col sm={10}>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="reason" sm={2}>
              Reason / السبب:
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="reason"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Signature / التوقيع:</Label>
            <Col sm={10}>
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'sigCanvas'
                }}
                onEnd={saveSignature}
              />
              <Button color="secondary" onClick={clearSignature}>
                Clear Signature / مسح التوقيع
              </Button>
            </Col>
          </FormGroup>
          {signatureData && (
            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <img
                  src={signatureData}
                  alt="Signature preview"
                  style={{
                    display: 'block',
                    margin: '10px 0',
                    border: '1px solid black',
                    maxWidth: '100%'
                  }}
                />
              </Col>
            </FormGroup>
          )}
   <FormGroup check row>
      <Col sm={{ size: 10, offset: 2 }}>
        <Button type="submit" color="primary">
          Submit Request / إرسال الطلب
        </Button>
            </Col>
          </FormGroup>
        </Form> {/* Make sure this closing tag exists */}
        {error && (
          <Alert color="danger" className="mt-3">
            Error submitting the leave request: {error.message || 'An error occurred'}
          </Alert>
        )}
      </CardBody>
          </Card>
        );
};

export default LeaveRequestForm;