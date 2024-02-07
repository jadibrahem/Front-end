import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const PurchaseRequestForm = () => {
    const navigate = useNavigate();
    const [documentReference, setDocumentReference] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [prData, setPrData] = useState({
        programme: '',
        location_required: '',
        date_required: '',
        comments: ''
    });
    const DONOR_CHOICES = [
        { label: 'N62', value: 'N62' },
        { label: 'Donor 2', value: 'donor2' },
        // Add more donor choices as needed
    ];
    const [items, setItems] = useState([
        { description: '', unit_cost: 0, quantity: 1, currency: 'IQD', donor: '', budget_line: '', comments: '', unit: 'none' }
    ]);
    const [unitChoices, setUnitChoices] = useState([
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
        { label: 'None', value: 'none' }
    ]);
    const [budgetLines, setBudgetLines] = useState([]);
    
    useEffect(() => {
        const fetchDocumentReference = async () => {
            const token = sessionStorage.getItem('token'); // Replace with your token retrieval logic
            const response = await axios.get('http://localhost:8000/document-reference/', {
                headers: { Authorization: `Token ${token}` },
            });
            setDocumentReference(response.data.document_reference);
        };
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
      
        const fetchBudgetLines = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/budget-lines/', {
                    headers: { Authorization: `Token ${token}` },
                });
                // Include the description in the state
                setBudgetLines(response.data.map(bl => ({ label: `${bl.name} - ${bl.description}`, value: bl.id })));
            } catch (error) {
                console.error('Error fetching budget lines:', error);
            }
        };
        fetchDocumentReference();
        fetchCurrentUser();
        fetchBudgetLines();
    }, [navigate]);

    const handlePrChange = (e) => {
        setPrData({ ...prData, [e.target.name]: e.target.value });
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
    const addItem = () => {
        setItems([...items, { description: '', unit_cost: 0, quantity: 1, currency: 'IQD', donor: '', budget_line: '', comments: '', unit: 'none' }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };
    const calculateItemTotal = (unitCost, quantity) => {
        return (parseFloat(unitCost) || 0) * (parseInt(quantity, 10) || 0);
    };

    // Function to calculate total cost for all items
    const calculateTotalPRCost = () => {
        return items.reduce((acc, item) => acc + calculateItemTotal(item.unit_cost, item.quantity), 0);
    }; 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const requestData = {
            ...prData,
            created_by: currentUser,
            document_reference: documentReference,
            items: items.map(item => ({
                ...item,
                unit_cost: parseFloat(item.unit_cost),
                quantity: parseInt(item.quantity, 10)
            }))
        };
        console.log("Submitting the following JSON data:", JSON.stringify(requestData, null, 2));
        try {
            const response = await axios.post('http://localhost:8000/create-purchase-request/', requestData, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Purchase Request Created:', response.data);
            navigate('/purchas-list'); // Adjust the route as necessary
        } catch (error) {
            console.error('Error submitting purchase request:', error);
            alert('Error: ' + (error.response?.data.detail || 'Something went wrong while submitting the request.'));
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center">Create Purchase Request</h1>
                    <p>Document Reference: {documentReference}</p> {/* Display the document reference */}
                    <p>Created By: {currentUser}</p>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="programme">Programme</Label>
                            <Input type="text" name="programme" id="programme" value={prData.programme} onChange={handlePrChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="location_required">Location Required</Label>
                            <Input type="text" name="location_required" id="location_required" value={prData.location_required} onChange={handlePrChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="date_required">Date Required</Label>
                            <Input type="date" name="date_required" id="date_required" value={prData.date_required} onChange={handlePrChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="comments">Comments</Label>
                            <Input type="textarea" name="comments" id="comments" value={prData.comments} onChange={handlePrChange} />
                            <p>Total Purchase Request Cost: {calculateTotalPRCost().toFixed(2)}</p>
                        </FormGroup>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Unit</th>
                                    <th>Unit Cost</th>
                                    <th>Quantity</th>
                                    <th>Currency</th>
                                    <th>Total Cost</th>
                                    <th>Donor</th>
                                    <th>Budget Line</th>
                                    <th>Comments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="select" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)}>
                                                {unitChoices.map(choice => (
                                                    <option key={choice.value} value={choice.value}>{choice.label}</option>
                                                ))}
                                            </Input>
                                        </td>
                                        <td>
                                            <Input type="number" name="unit_cost"  value={typeof item.unit_cost === 'number' ? item.unit_cost.toFixed(2) : '0.00'} onChange={(e) => handleItemChange(index, e)}/>
                                        </td>
                                        <td>
                                            <Input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="select" name="currency" value={item.currency} onChange={(e) => handleItemChange(index, e)}>
                                                <option value="IQD">IQD</option>
                                            </Input>
                                        </td>
                                        <td>{calculateItemTotal(item.unit_cost, item.quantity).toFixed(2)}</td>
                                        <td>
                                        <Input type="select" name="donor" value={item.donor} onChange={(e) => handleItemChange(index, e)}>
                                            <option value="">Select Donor</option>
                                            {DONOR_CHOICES.map(donor => (
                                                <option key={donor.value} value={donor.value}>{donor.label}</option>
                                            ))}
                                        </Input>
                                        </td>
                                        <td>
                                            <Input type="select" name="budget_line" value={item.budget_line} onChange={(e) => handleItemChange(index, e)}>
                                                <option value="">Select Budget Line</option>
                                                {budgetLines.map(line => (
                                                    <option key={line.value} value={line.value}>{line.label}</option> // label now includes the description
                                                ))}
                                            </Input>
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
                        <Button type="submit" color="primary">Submit Purchase Request</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default PurchaseRequestForm;
