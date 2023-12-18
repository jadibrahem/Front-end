import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Table } from 'reactstrap';

const EmployeeByNum = () => {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const { insuranceNumber } = useParams();
    const baseURL = 'http://127.0.0.1:8000';
    useEffect(() => {
        axios.get(`https://halotrust.pythonanywhere.com/employee/${insuranceNumber}/`)
            .then(response => setEmployee(response.data))
            .catch(error => setError('Employee not found'));
    }, [insuranceNumber]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="my-5">
            <Row>
                <Col md={4}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Personal Data</CardTitle>
                            <img
                                    src={employee.ProfileImage ? `${baseURL}${employee.ProfileImage}` : 'path_to_default_image'}
                                    alt={`${employee.FirstName}'s Profile`}
                                    className="img-thumbnail mb-3"
                                />
                            <ListGroup>
                                <ListGroupItem>Full Name: {employee.FirstName} {employee.LastName}</ListGroupItem>
                                <ListGroupItem>Position: {employee.position_detail.Name}</ListGroupItem>
                                <ListGroupItem>Email: {employee.Email}</ListGroupItem>
                                <ListGroupItem>Phone: {employee.Phone}</ListGroupItem>
                                {/* More personal details */}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Additional Data</CardTitle>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <th>Nationality</th>
                                        <td>{employee.Nationality}</td>
                                    </tr>
                                    <tr>
                                        <th>Date of Birth</th>
                                        <td>{employee.DateOfBirth}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender</th>
                                        <td>{employee.Gender}</td>
                                    </tr>
                                    <tr>
                                        <th>Marital Status</th>
                                        <td>{employee.MaritalStatus}</td>
                                    </tr>
                                    <tr>
                                        <th>Insurance Number</th>
                                        <td>{employee.InsuranceNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>Passport Number</th>
                                        <td>{employee.PassportNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{employee.Address ? `${employee.Address.Street}, ${employee.Address.City}, ${employee.Address.State}, ${employee.Address.Country}` : 'Not provided'}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Col md={8}>
                    {/* Additional cards for work data, documents, etc. */}
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Documents</CardTitle>
                            <ListGroup>
                                {employee.documents.map(doc => (
                                    <ListGroupItem key={doc.id}>
                                        <a href={doc.file} target="_blank" rel="noopener noreferrer">{doc.description}</a>
                                        <p>Uploaded at: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Signature</CardTitle>
                          {/* <img
                            src={`${baseURL}${employee.signature.signature_file}`}
                            alt="Signature"
                            className="img-thumbnail mb-3"
                        /> */}
                        </CardBody>
                    </Card>
                </Col>
                    {/* Include other cards for documents, work data, etc. */}
                    {/* ... */}
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeByNum;