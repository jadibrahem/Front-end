import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { employeeId } = useParams(); 

    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `http://127.0.0.1:8000/employee/${employeeId}`;
        console.log('API URL:', apiUrl);
        
        axios.get(apiUrl)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(err => {
                console.error('Error fetching employee details:', err);
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [employeeId]);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner color="primary" />
                <p>Loading employee details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert color="danger">
                Error loading employee details: {error.response ? error.response.data : 'A network error occurred'}
            </Alert>
        );
    }

    if (!employee) {
        return <Alert color="warning">Employee not found.</Alert>;
    }

    return (
        <Card>
            <CardBody>
                <CardTitle tag="h5">Employee Details</CardTitle>
                <ListGroup>
                    <ListGroupItem>ID: {employee.EmployeeID}</ListGroupItem>
                    <ListGroupItem>First Name: {employee.FirstName}</ListGroupItem>
                    <ListGroupItem>Last Name: {employee.LastName}</ListGroupItem>
                    {/* Add other list group items for employee details as needed */}
                </ListGroup>
            </CardBody>
        </Card>
    );
};

export default EmployeeDetails;