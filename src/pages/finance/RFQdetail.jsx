    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Container, Row, Col, Table, Alert, Card, CardHeader, CardBody } from 'reactstrap';
    // Make sure to create and style your QR page
    // Make sure this function exists and is imported correctly
    import './qr.css';
    const QuotationRequestDetail = () => {
        const { requestId } = useParams();
        const navigate = useNavigate();
        const [quotationRequest, setQuotationRequest] = useState(null);
        const [currentUser, setCurrentUser] = useState({ username: '', userType: '' });
        const [error, setError] = useState('');

        useEffect(() => {
            const fetchQuotationRequestAndUser = async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const [qrResponse, userResponse] = await Promise.all([
                        axios.get(`http://localhost:8000/quotation-requests/${requestId}/`, {
                            headers: { Authorization: `Token ${token}` },
                        }),
                        axios.get('http://localhost:8000/current-user/', {
                            headers: { Authorization: `Token ${token}` },
                        })
                    ]);
                    setQuotationRequest(qrResponse.data);
                    setCurrentUser({ username: userResponse.data.username, userType: userResponse.data.user_type });
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Failed to load quotation request or user data');
                }
            };

            fetchQuotationRequestAndUser();
        }, [requestId]);

        if (!quotationRequest) {
            return <div>Loading...</div>;
        }

        return (
            <Container className="quotation-detail">
                <Row>
                    <Col>
                        {error && <Alert color="danger">{error}</Alert>}
                        <h1 className="page-title">Quotation Request: {quotationRequest.reference}</h1>
                        
                        <Card className="detail-card mb-4">
                            <CardHeader>Main Details</CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <th>Programme</th>
                                            <td>{quotationRequest.programme}</td>
                                        </tr>
                                        <tr>
                                            <th>Submission Date</th>
                                            <td>{quotationRequest.submission_date}</td>
                                        </tr>
                                        <tr>
                                            <th>Quotation Required By</th>
                                            <td>{quotationRequest.quotation_required_by}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
    
                        <Card className="detail-card mb-4">
                            <CardHeader>Supplier Information</CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <td>{quotationRequest.supplier.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Contact Person</th>
                                            <td>{quotationRequest.supplier.contact_person}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{quotationRequest.supplier.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Telephone</th>
                                            <td>{quotationRequest.supplier.telephone}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
    
                        <Card className="detail-card mb-4">
                            <CardHeader>Items</CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Unit</th>
                                            <th>Unit Cost</th>
                                            <th>Quantity</th>
                                            <th>Total Cost</th>
                                            <th>Lead Time</th>
                                            <th>Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotationRequest.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.unit_cost}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.quantity * item.unit_cost}</td>
                                                <td>{item.lead_time}</td>
                                                <td>{item.comments}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
    
                        <Card className="detail-card">
                            <CardHeader>Terms and Conditions</CardHeader>
                            <CardBody>
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <th>Payment Terms</th>
                                            <td>{quotationRequest.terms.payment_terms}</td>
                                        </tr>
                                        <tr>
                                            <th>Delivery</th>
                                            <td>{quotationRequest.terms.delivery_or_collection}</td>
                                        </tr>
                                        <tr>
                                            <th>Delivery Costs</th>
                                            <td>{quotationRequest.terms.delivery_costs}</td>
                                        </tr>
                                        <tr>
                                            <th>Warranty</th>
                                            <td>{quotationRequest.terms.warranty_information}</td>
                                        </tr>
                                        <tr>
                                            <th>Validity</th>
                                            <td>{quotationRequest.terms.validity}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
    
                    </Col>
                </Row>
            </Container>
        );
    };
    
    export default QuotationRequestDetail;
