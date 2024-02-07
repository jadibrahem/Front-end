import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Alert , Input } from 'reactstrap';
import './pr.css'
import { generatePDF } from  './PurchaseRequestDetailpdf.jsx'
const PurchaseRequestDetail = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [purchaseRequest, setPurchaseRequest] = useState(null);
    const [currentUser, setCurrentUser] = useState({ username: '', userType: '' });
    const [error, setError] = useState('');
    const [approvalLogs, setApprovalLogs] = useState([]);
    const [editedItems, setEditedItems] = useState({});
    const [editItemIndex, setEditItemIndex] = useState(null);
    useEffect(() => {
        const fetchPurchaseRequestAndUser = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const [prResponse, userResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/purchase-requests/${requestId}/`, {
                        headers: { Authorization: `Token ${token}` },
                    }),
                    axios.get('http://localhost:8000/current-user/', {
                        headers: { Authorization: `Token ${token}` },
                    })
                ]);
                setPurchaseRequest(prResponse.data);
                setCurrentUser({ username: userResponse.data.username, userType: userResponse.data.user_type });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load purchase request or user data');
            }
        };
    
        fetchPurchaseRequestAndUser();
    }, [requestId]);
    useEffect(() => {
        const fetchApprovalLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/purchase-requests/${requestId}/approval-logs/`, {
                    headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
                });
                setApprovalLogs(response.data);
            } catch (error) {
                console.error('Error fetching approval logs:', error);
                setError('Failed to load approval logs');
            }
        };
    
        const fetchPurchaseRequestAndUser = async () => {
            // Existing code to fetch purchase request and user details
        };
    
        fetchPurchaseRequestAndUser();
        fetchApprovalLogs(); // Fetch approval logs
    }, [requestId]);
    const handleApprove = async () => {
        try {
            await axios.post(`http://localhost:8000/purchase-requests/${requestId}/approve/`, {}, {
                headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
            });
            navigate('/purchas-list'); // Ensure this route is correct
        } catch (error) {
            console.error('Error approving purchase request:', error);
            setError('Failed to approve the purchase request');
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`http://localhost:8000/purchase-requests/${requestId}/reject/`, {}, {
                headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
            });
            navigate('/purchas-list'); // Ensure this route is correct
        } catch (error) {
            console.error('Error rejecting purchase request:', error);
            setError('Failed to reject the purchase request');
        }
    };
    const handleEdit = (index) => {
        setEditItemIndex(index);
        const item = purchaseRequest.items[index];
        setEditedItems({
            ...editedItems,
            [index]: { ...item }
        });
    };

    const handleChange = (index, field, value) => {
        setEditedItems({
            ...editedItems,
            [index]: {
                ...editedItems[index],
                [field]: value
            }
        });
    };

    const handleSave = async (index) => {
        const item = editedItems[index];
        // Call your API to update the item
        try {
            await axios.patch(`http://localhost:8000/items/${item.id}/`, item, {
                headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
            });
            // Update local state to reflect the saved changes
            let updatedItems = [...purchaseRequest.items];
            updatedItems[index] = item;
            setPurchaseRequest({ ...purchaseRequest, items: updatedItems });
            // Reset edit state
            setEditItemIndex(null);
            setEditedItems({});
        } catch (error) {
            console.error('Error updating item:', error);
            // Handle error (e.g., display an error message)
        }
    };

    const handleCancel = (index) => {
        setEditItemIndex(null);
        // Optionally revert edited item to original
        const originalItem = purchaseRequest.items[index];
        setEditedItems({
            ...editedItems,
            [index]: { ...originalItem }
        });
    };
    if (!purchaseRequest) {
        return <div>Loading...</div>;
    }

    const canApproveOrReject = currentUser.userType === 'budget_holder' || currentUser.userType === 'finance_checker';


    const nextExpectedStatus = getNextExpectedStatus(purchaseRequest.status);

    return (
        <Container className="purchase-request-detail">
      
            <Row>
                <Col>
                    <h1 className="text-center">Purchase Request Detail</h1>
                    {error && <Alert color="danger">{error}</Alert>}
                    <div className="user-info">Logged in as: <strong>{currentUser.username}</strong> ({currentUser.userType})</div>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <th>Programme:</th>
                                <td>{purchaseRequest.programme}</td>
                                <th>Document Reference:</th>
                                <td>{purchaseRequest.document_reference}</td>
                            </tr>
                            <tr>
                                <th>Purchase Request Date:</th>
                                <td>{new Date(purchaseRequest.purchase_request_date).toLocaleDateString()}</td>
                                <th>Location Required:</th>
                                <td>{purchaseRequest.location_required}</td>
                            </tr>
                            <tr>
                                <th>Date Required:</th>
                                <td>{new Date(purchaseRequest.date_required).toLocaleDateString()}</td>
                                <th>Status:</th>
                                <td>{purchaseRequest.status}</td>
                            </tr>
                            <tr>
                                <th>Created By:</th>
                                <td>{purchaseRequest.created_by}</td>
                                <th>User Type:</th>
                                <td>{purchaseRequest.user_type}</td>
                            </tr>
                            <tr>
                                <th>Total Cost:</th>
                                <td>{purchaseRequest.total_cost}</td>
                                <th>Comments:</th>
                                <td>{purchaseRequest.comments || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h2>Items</h2>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Item No.</th>
                              
                                <th>Description</th>
                                <th>Unit</th>
                                <th>Unit Cost</th>
                                <th>Quantity</th>
                                <th>Currency</th>
                                <th>Total Cost</th>
                                <th>Donor</th>
                                <th>Budget Line</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                        {purchaseRequest.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {editItemIndex === index ? (
                                    // Input fields for editing
                                    <>
                                        <td><Input type="text" value={editedItems[index].description} onChange={(e) => handleChange(index, 'description', e.target.value)} /></td>
                                        <td><Input type="text" value={editedItems[index].unit} onChange={(e) => handleChange(index, 'unit', e.target.value)} /></td>
                                        <td><Input type="number" value={editedItems[index].unit_cost} onChange={(e) => handleChange(index, 'unit_cost', e.target.value)} /></td>
                                        <td><Input type="number" value={editedItems[index].quantity} onChange={(e) => handleChange(index, 'quantity', e.target.value)} /></td>
                                        <td><Input type="text" value={editedItems[index].currency} onChange={(e) => handleChange(index, 'currency', e.target.value)} /></td>
                                        <td>{item.total_cost}</td> {/* Total cost may be recalculated on the backend or dynamically on the frontend */}
                                        <td><Input type="text" value={editedItems[index].donor} onChange={(e) => handleChange(index, 'donor', e.target.value)} /></td>
                                        <td><Input type="text" value={editedItems[index].budget_line} onChange={(e) => handleChange(index, 'budget_line', e.target.value)} /></td>
                                        <td><Input type="text" value={editedItems[index].comments} onChange={(e) => handleChange(index, 'comments', e.target.value)} /></td>
                                        <td>
                                            <Button color="success" onClick={() => handleSave(index)}>Save</Button>
                                            <Button color="secondary" onClick={() => handleCancel(index)}>Cancel</Button>
                                        </td>
                                    </>
                                ) : (
                                    // Static display of item details
                                    <>
                                        <td>{item.description}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.unit_cost}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.currency}</td>
                                        <td>{item.total_cost}</td>
                                        <td>{item.donor || 'N/A'}</td>
                                        <td>{item.budget_line || 'N/A'}</td>
                                        <td>{item.comments || 'N/A'}</td>
                                        <td><Button color="primary" onClick={() => handleEdit(index)}>Edit</Button></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    </Table>
                    {canApproveOrReject && (
                        <div>
                            <Button color="success" onClick={handleApprove} className="me-2">Approve</Button>
                            <Button color="danger" onClick={handleReject}>Reject</Button>
                        </div>
                    )}
                    <div className="status-info">Next expected status after approval: {nextExpectedStatus}</div>
                </Col>
                <Button color="primary" onClick={() => generatePDF(purchaseRequest, approvalLogs)}>Download PDF</Button>
// ...
            </Row>

        </Container>
    );
};
export default PurchaseRequestDetail;
function getNextExpectedStatus(currentStatus) {
    switch (currentStatus) {
        case 'pending':
            return 'approved_budget_holder'; // Replace with the actual next status
        case 'approved_budget_holder':
            return 'approved_finance_checker'; // Replace as needed
        // Add more cases as per your workflow
        default:
            return 'unknown';
    }
}