import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const UNIT_CHOICES = [
    { label: 'Day', value: 'day' },
    { label: 'Flights', value: 'flights' },
    { label: 'Number', value: 'number' },
    { label: 'Months', value: 'months' },
    { label: 'Times', value: 'times' },
    { label: 'Liter', value: 'liter' },
    { label: 'Kg', value: 'kg' },
    { label: 'Pieces', value: 'pcs' },
    { label: 'Trip', value: 'trip' },
    { label: 'Lump Sum', value: 'lump_sum' },
    { label: 'None', value: 'none' },
];

const RFQForm = () => {
    const navigate = useNavigate();
    const [lastSubmittedData, setLastSubmittedData] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [rfqData, setRfqData] = useState({
        programme: '',
        submission_date: '',
        quotation_required_by: '',
    });
    const [supplier, setSupplier] = useState({
        name: '',
        address: '',
        contact_person: '',
        email: '',
        telephone: '',
    });
    const [items, setItems] = useState([
        { name: '',  unit_cost: 0 , unit: 'none', unit_rate: 0, quantity: 1, lead_time: '', comments: '' },
    ]);
    const [terms, setTerms] = useState({
        payment_terms: '',
        delivery_or_collection: '',
        delivery_costs: '',
        warranty_information: '',
        validity: '',
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) navigate('/login');
            try {
                const response = await axios.get('http://localhost:8000/current-user/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setCurrentUser(response.data.username);
            } catch (error) {
                console.error('Error fetching current user:', error);
                navigate('/login');
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    const handleRfqChange = (e) => {
        setRfqData({ ...rfqData, [e.target.name]: e.target.value });
    };

    const handleSupplierChange = (e) => {
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    };
    const handleItemChange = (index, e) => {
        const updatedItems = [...items];
        const { name, value } = e.target;
    
        if (name === "unit_cost") {
            // Use parseFloat to ensure value is treated as a number
            const numericValue = parseFloat(value);
    
            // If the parsed value is NaN (not a number), set it to 0
            updatedItems[index] = { ...updatedItems[index], [name]: isNaN(numericValue) ? 0 : numericValue };
        } else {
            updatedItems[index] = { ...updatedItems[index], [name]: value };
        }
    
        setItems(updatedItems);
    };
    const handleTermsChange = (e) => {
        setTerms({ ...terms, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        setItems([...items, { name: '', unit_cost: 0 ,unit: 'none', unit_rate: 0, quantity: 1, lead_time: '', comments: '' }]);
    };
    const calculateTotalCost = (unitCost, quantity) => {
        return (unitCost * quantity).toFixed(2); // Ensures the total is fixed to two decimal places
    };
    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
       
    
        const requestData = {
            ...rfqData,
            supplier,
            items: items.map(item => ({
                ...item,
                unit_rate: parseFloat(item.unit_rate),
                quantity: parseInt(item.quantity, 10),
            })),
            terms,
            created_by: currentUser,
        };
    
        // Update the state with the stringified request data
        setLastSubmittedData(JSON.stringify(requestData, null, 2));
    
        const token = sessionStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/quotation-requests/create/', requestData, {
                headers: { Authorization: `Token ${token}` },
            });
            alert('RFQ submitted successfully');
            navigate('/rfq-list');
        } catch (error) {
            console.error('Error creating RFQ:', error);
            alert('Error: ' + (error.response?.data.detail || 'Something went wrong while submitting the RFQ.'));
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center">Create Request for Quotation (RFQ)</h1>
                    <p>Created By: {currentUser}</p>
                    <div>
                    <h3>Last Submitted Data</h3>
                    <pre>{lastSubmittedData}</pre>
                </div>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="programme">Programme</Label>
                            <Input type="text" name="programme" id="programme" value={rfqData.programme} onChange={handleRfqChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="submission_date">Submission Date</Label>
                            <Input type="date" name="submission_date" id="submission_date" value={rfqData.submission_date} onChange={handleRfqChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="quotation_required_by">Quotation Required By</Label>
                            <Input type="date" name="quotation_required_by" id="quotation_required_by" value={rfqData.quotation_required_by} onChange={handleRfqChange} />
                        </FormGroup>

                        <h2>Supplier Information</h2>
                        <FormGroup>
                            <Label for="supplier_name">Name</Label>
                            <Input type="text" name="name" id="supplier_name" value={supplier.name} onChange={handleSupplierChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="supplier_address">Address</Label>
                            <Input type="text" name="address" id="supplier_address" value={supplier.address} onChange={handleSupplierChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="supplier_contact_person">Contact Person</Label>
                            <Input type="text" name="contact_person" id="supplier_contact_person" value={supplier.contact_person} onChange={handleSupplierChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="supplier_email">Email</Label>
                            <Input type="email" name="email" id="supplier_email" value={supplier.email} onChange={handleSupplierChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="supplier_telephone">Telephone</Label>
                            <Input type="text" name="telephone" id="supplier_telephone" value={supplier.telephone} onChange={handleSupplierChange} />
                        </FormGroup>

                        <h2>Quotation Items</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Unit Cost</th>
                                    <th>Unit</th>
                                    <th>Unit Rate</th>
                                    <th>Quantity</th>
                                    <th>Total Cost</th>
                                    <th>Lead Time</th>
                                    <th>Comments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="number" name="unit_cost"  value={typeof item.unit_cost === 'number' ? item.unit_cost.toFixed(2) : '0.00'} onChange={(e) => handleItemChange(index, e)}/>
                                        </td>
                                        <td>
                                            <Input type="select" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)}>
                                                {UNIT_CHOICES.map(choice => (
                                                    <option key={choice.value} value={choice.value}>{choice.label}</option>
                                                ))}
                                            </Input>
                                        </td>
                                        
                                        <td>
                                            <Input type="number" name="unit_rate" value={item.unit_rate} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>{calculateTotalCost(item.unit_cost, item.quantity)}</td> 
                                        <td>
                                            <Input type="text" name="lead_time" value={item.lead_time} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="text" name="comments" value={item.comments} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Button color="danger" onClick={() => removeItem(index)}>Remove</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button color="success" onClick={addItem}>Add Item</Button>

                        <h2>Quotation Terms</h2>
                        <FormGroup>
                            <Label for="payment_terms">Payment Terms</Label>
                            <Input type="textarea" name="payment_terms" id="payment_terms" value={terms.payment_terms} onChange={handleTermsChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="delivery_or_collection">Delivery or Collection</Label>
                            <Input type="text" name="delivery_or_collection" id="delivery_or_collection" value={terms.delivery_or_collection} onChange={handleTermsChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="delivery_costs">Delivery Costs</Label>
                            <Input type="text" name="delivery_costs" id="delivery_costs" value={terms.delivery_costs} onChange={handleTermsChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="warranty_information">Warranty Information</Label>
                            <Input type="textarea" name="warranty_information" id="warranty_information" value={terms.warranty_information} onChange={handleTermsChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="validity">Validity</Label>
                            <Input type="text" name="validity" id="validity" value={terms.validity} onChange={handleTermsChange} />
                        </FormGroup>

                        <Button type="submit" color="primary">Submit RFQ</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RFQForm;