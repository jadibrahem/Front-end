import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
const PurchaseRequestForm = () => {
    const navigate = useNavigate();
    const [requestJson, setRequestJson] = useState('');
    const [documentReference, setDocumentReference] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [prData, setPrData] = useState({
        programme: '',
        location_required: '',
        date_required: '',
        comments: ''
    });
    const [items, setItems] = useState([
        { name: '', description: '', unit_cost: '', quantity: '', currency: 'IQD', donor: '', budget_line: '', comments: '', unit: '' }
    ]);
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
            const response = await axios.get('http://localhost:8000/current-user/', {
                headers: { Authorization: `Token ${token}` },
            });
            setCurrentUser(response.data.username);
        };

        fetchDocumentReference();
        fetchCurrentUser();
    }, []);

    const handlePrChange = (e) => {
        setPrData({ ...prData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [e.target.name]: e.target.value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', description: '', unit_cost: '', quantity: '', currency: 'IQD', donor: '', budget_line: '', comments: '', unit: '' }]);
    };

    const removeItem = (index) => {
        const filteredItems = items.filter((_, i) => i !== index);
        setItems(filteredItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
    
        const formattedItems = items.map(item => ({
            name: item.name,
            description: item.description,
            unit_cost: parseFloat(item.unit_cost) || 0,
            quantity: parseInt(item.quantity, 10) || 0,
            currency: item.currency,
            donor: item.donor,
            budget_line: item.budget_line,
            comments: item.comments,
            unit: item.unit
        }));
    
        const requestData = {
            ...prData,
            created_by: currentUser,
            document_reference: documentReference,
            items: formattedItems
        };
    
        // Print the request data to the console for debugging
        console.log('Sending Purchase Request Data:', requestData);
        setRequestJson(JSON.stringify(requestData, null, 2));
        try {
            const response = await axios.post('http://localhost:8000/create-purchase-request/', requestData, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Purchase Request Created:', response.data);
            navigate('/purchas-listt');
            // Handle success - clear the form, redirect, show success message, etc.
        } catch (error) {
            console.error('Error submitting purchase request:', error);
            // Detailed error handling
            if (error.response) {
                // Server responded with a status code that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                alert('Error: ' + (error.response.data.detail || 'Something went wrong while submitting the request.'));
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                alert('Error: No response received. Please check your network.');
            } else {
                // Something else caused the error
                console.error('Error message:', error.message);
                alert('Error: ' + error.message);
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    
                    <h1 className="text-center">Create Purchase Request</h1>
                    <p>Document Reference: {documentReference}</p> {/* Display the document reference */}
                    <p>Created By: {currentUser}</p> {/* Display the current user */}
                    {requestJson && (
                        <>
                            <h3>Request Data (JSON):</h3>
                            <pre>{requestJson}</pre> {/* Display the formatted JSON data */}
                        </>
                    )}
                    <Form onSubmit={handleSubmit}>
                        {/* Form fields for PurchaseRequest */}
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
                        </FormGroup>

                        {/* Table for items */}
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Unit</th>
                                    <th>Unit Cost</th>
                                    <th>Quantity</th>
                                    <th>Currency</th>
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
                                            <Input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="number" name="unit_cost" value={item.unit_cost} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="select" name="currency" value={item.currency} onChange={(e) => handleItemChange(index, e)}>
                                                <option value="IQD">IQD</option>
                                                {/* Add more currency options as needed */}
                                            </Input>
                                        </td>
                                        <td>
                                            <Input type="text" name="donor" value={item.donor} onChange={(e) => handleItemChange(index, e)} />
                                        </td>
                                        <td>
                                            <Input type="text" name="budget_line" value={item.budget_line} onChange={(e) => handleItemChange(index, e)} />
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
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';

// const PurchaseRequestForm = () => {
//     // State for the document reference, fetched from the backend
//     const [documentReference, setDocumentReference] = useState('');

//     // State for purchase request data
//     const [prData, setPrData] = useState({
//         programme: '',
//         location_required: '',
//         date_required: '',
//         total_cost: 0,
//         comments: ''
//     });

//     // State for the list of items
//     const [items, setItems] = useState([
//         { name: '', description: '', unitCost: '', quantity: '', currency: 'IQD', donor: '', budget_line: '', comments: '' }
//     ]);

//     useEffect(() => {
//         // Fetch document reference from backend
//         const fetchDocumentReference = async () => {
//             const token = sessionStorage.getItem('token');
//             const response = await axios.get('http://localhost:8000/document-reference/', {
//                 headers: { Authorization: `Token ${token}` },
//             });
//             setDocumentReference(response.data.document_reference);
//         };
        
//         fetchDocumentReference();
//     }, []);

//     // Handle changes in purchase request form fields
//     const handlePrChange = (e) => {
//         const { name, value } = e.target;
//         setPrData({ ...prData, [name]: value });
//     };

//     // Handle changes in item fields
//     const handleItemChange = (index, e) => {
//         const newItems = [...items];
//         newItems[index] = { ...newItems[index], [e.target.name]: e.target.value };
//         setItems(newItems);
//     };

//     // Add a new item to the form
//     const addItem = () => {
//         setItems([...items, { name: '', description: '', unitCost: '', quantity: '', currency: 'IQD', donor: '', budget_line: '', comments: '' }]);
//     };

//     // Remove an item from the form
//     const removeItem = (index) => {
//         setItems(items.filter((_, i) => i !== index));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = sessionStorage.getItem('token');
//         const formattedItems = items.map(item => ({
//             name: item.name,
//             description: item.description,
//             unit_cost: parseFloat(item.unitCost) || 0,
//             quantity: parseInt(item.quantity, 10) || 0,
//             currency: item.currency,
//             donor: item.donor,
//             budget_line: item.budget_line,
//             comments: item.comments,
//         }));
        

      
//     // Prepare the full request data
//     const requestData = {
//         programme: prData.programme,
//         location_required: prData.location_required,
//         date_required: prData.date_required,
//         comments: prData.comments,
//         // Exclude 'total_cost' if it's calculated on the backend
//         document_reference: documentReference, // Assuming this is fetched correctly from the backend
//         items: formattedItems
//     };

//     // Log the request data to the console for debugging
//     console.log('Submitting Purchase Request Data:', requestData);

//     try {
//         const response = await axios.post('http://localhost:8000/purchase-requests/', requestData, {
//             headers: { Authorization: `Token ${token}` }
//         });
//         console.log('Purchase Request Created:', response.data);
//         // Handle success, e.g., clearing the form, displaying success message, etc.
//     } catch (error) {
//         console.error('Error submitting purchase request:', error);
//         // Detailed error handling
//         if (error.response) {
//             // Server responded with a status code outside the 2xx range
//             console.error('Error response data:', error.response.data);
//             console.error('Error response status:', error.response.status);
//             alert('Error: ' + (error.response.data.detail || 'Something went wrong while submitting the request.'));
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.error('Error request:', error.request);
//             alert('Error: No response received. Please check your network.');
//         } else {
//             // Something else caused the error
//             console.error('Error message:', error.message);
//             alert('Error: ' + error.message);
//         }
//     }
// };
    
//     return (
//         <Container>
//             <Row>
//                 <Col>
//                     <h1 className="text-center my-4">Create Purchase Request</h1>
//                     <Form onSubmit={handleSubmit}>
//                         {/* Form fields for PurchaseRequest data */}
//                         <FormGroup>
//                             <Label for="programme">Programme</Label>
//                             <Input type="text" name="programme" id="programme" value={prData.programme} onChange={handlePrChange} />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="locationRequired">Location Required</Label>
//                             <Input type="text" name="location_required" id="locationRequired" value={prData.location_required} onChange={handlePrChange} />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="dateRequired">Date Required</Label>
//                             <Input type="date" name="date_required" id="dateRequired" value={prData.date_required} onChange={handlePrChange} />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="comments">Comments</Label>
//                             <Input type="textarea" name="comments" id="comments" value={prData.comments} onChange={handlePrChange} />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="totalCost">Total Cost</Label>
//                             <Input type="number" name="total_cost" id="totalCost" value={prData.total_cost} onChange={handlePrChange} readOnly />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="documentReference">Document Reference</Label>
//                             <Input type="text" name="document_reference" id="documentReference" value={documentReference} readOnly />
//                         </FormGroup>

//                         {/* Table for PurchaseRequestItem data */}
//                         <Table bordered>
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Name</th>
//                                     <th>Description</th>
//                                     <th>Unit Cost</th>
//                                     <th>Quantity</th>
//                                     <th>Currency</th>
//                                     <th>Donor</th>
//                                     <th>Budget Line</th>
//                                     <th>Comments</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {items.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <Input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="number" name="unitCost" value={item.unitCost} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="select" name="currency" value={item.currency} onChange={(e) => handleItemChange(index, e)}>
//                                                 <option value="IQD">IQD</option>
//                                                 {/* Add more currency options as needed */}
//                                             </Input>
//                                         </td>
//                                         <td>
//                                             <Input type="text" name="donor" value={item.donor} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="text" name="budget_line" value={item.budget_line} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Input type="text" name="comments" value={item.comments} onChange={(e) => handleItemChange(index, e)} />
//                                         </td>
//                                         <td>
//                                             <Button color="danger" onClick={() => removeItem(index)}>Remove</Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                         <Button color="success" onClick={addItem}>Add Item</Button>
//                         <Button type="submit" color="primary" className="float-right">Submit Purchase Request</Button>
//                     </Form>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default PurchaseRequestForm;
