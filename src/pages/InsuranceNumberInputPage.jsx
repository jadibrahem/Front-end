import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Label, Input, Button, Form } from 'reactstrap';

const InsuranceNumberInputPage = () => {
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [selectedOption, setSelectedOption] = useState('employeeDetails');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOption === 'employeeDetails') {
            navigate(`/EmployeeByNum/${insuranceNumber}`);
        } else if (selectedOption === 'leaveInfo') {
            navigate(`/employee/${insuranceNumber}/leaves`);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="insuranceNumber">Enter Insurance Number:</Label>
                <Input
                    type="text"
                    name="insuranceNumber"
                    id="insuranceNumber"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value)}
                    placeholder="Insurance Number"
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="selectOption">Select Option:</Label>
                <Input
                    type="select"
                    name="selectOption"
                    id="selectOption"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="employeeDetails">Employee Details</option>
                    <option value="leaveInfo">Leave Information</option>
                </Input>
            </FormGroup>
            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default InsuranceNumberInputPage;