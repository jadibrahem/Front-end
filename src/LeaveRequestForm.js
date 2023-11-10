import React, { useRef, useState } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';

const LeaveRequestForm = () => {
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [leaveType, setLeaveType] = useState('paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const sigCanvas = useRef({});

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
      url: 'http://127.0.0.1:8000/leave-request/',
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
    <div>
      
      <form onSubmit={handleSubmit}>
      <div>
        <label>
            Insurance Number:
            <input
            type="text"
            value={insuranceNumber}
            onChange={(e) => setInsuranceNumber(e.target.value)}
            required
            />
        </label>
        </div>
        <div>
        <label>
            Leave Type:
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="paid">paid</option> 
                <option value="unpaid">Unpaid</option>
                <option value="sick">Sick Leave</option> 
                </select>
        </label>
        </div>
        <div>
        <label>
            Start Date:
            <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            />
        </label>
        </div>
        <div>
        <label>
            End Date:
            <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            />
        </label>
        </div>
        <div>
        <label>
            Reason:
            <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            />
        </label>
        </div>
        <div>
          <label>Signature:</label>
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
          <button type="button" onClick={clearSignature}>Clear Signature</button>
        </div>
        {signatureData && (
          <div>
            <img
              src={signatureData}
              alt="Signature preview"
              style={{
                display: 'block',
                margin: '10px 0',
                border: '1px solid black'
              }}
            />
          </div>
        )}
        <div>
          <button type="submit">Submit Request</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;