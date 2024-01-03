import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

const Dashboard = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Replace with your actual API endpoint
        axios.get('https://halotrust.pythonanywhere.com/org-structure/')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the employee structure:', error);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="text-center my-4">Employee Structure</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {departments.map(department => (
                    <Card key={department.Department} style={{ width: '18rem', marginBottom: '1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardBody>
                            <CardTitle tag="h5" className="text-center">{department.Department}</CardTitle>
                            <ListGroup flush>
                                {department.Positions.map(position => (
                                    <ListGroupItem key={position.Position}>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <img
                                                src={position.ProfileImage}
                                                alt={position.Name}
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
                                            />
                                            <div>
                                                <h6 className="mb-0">{position.Position}</h6>
                                                <small>{position.Level}</small>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            {position.Employees.map(employee => (
                                                <div key={employee.Name} className="mb-2">
                                                    <strong>{employee.Name}</strong> - Hired: {employee.DateHired}
                                                </div>
                                            ))}
                                        </div>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;