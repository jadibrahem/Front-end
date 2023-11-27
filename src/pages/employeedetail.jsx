import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { EmployeeID } = useParams(); 

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://127.0.0.1:8000/employee/${EmployeeID}`)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(err => {
                setError(`Error fetching employee details: ${err.message || 'unknown error'}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [EmployeeID]);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner />
                <p>Loading employee details...</p>
            </div>
        );
    }

    if (error) {
        return <Alert color="danger">{error}</Alert>;
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