import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import './formselection.css';
const FormSelectionPage = () => {
  const navigate = useNavigate();

  const formTypes = [
    { name: 'Leave Request', path: '/leave-request' },
    { name: 'Employee information ', path: '/InsuranceNumberInputPage' },
    { name: 'Leaves Information Request', path: '/InsuranceNumberInputPage' },
    { name: 'Attendance Info', path: '/attendance-info-request-form' },
  ];

  const handleCreateClick = (path) => {
    navigate(path);
  };

  return (
    <div className="form-selection-container">
      <h2>Create Form</h2>
      <div className="form-selection-grid">
        {formTypes.map((form, index) => (
          <Card key={index}>
            <CardBody>
              <CardTitle>{form.name}</CardTitle>
              <Button className="button-create" color="primary" onClick={() => handleCreateClick(form.path)}>
                Request
                </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormSelectionPage;