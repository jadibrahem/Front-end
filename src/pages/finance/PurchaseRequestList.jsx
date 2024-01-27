import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f7f7f7',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
    },
    title: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    filters: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    filterGroup: {
      flexBasis: '48%',
    },
    tableResponsive: {
      overflowX: 'auto',
    },
    addButton: {
      marginBottom: '20px',
    },
    currentUserInfo: {
        backgroundColor: '#e9ecef',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        marginBottom: '20px',
      },
  };
const PurchaseRequestList = () => {
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState('');
    useEffect(() => {
        // Fetch purchase requests from the backend
        const fetchPurchaseRequests = async () => {
            try {
                // Retrieve the token and make an auth call to your API
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/purchase-requests/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setPurchaseRequests(response.data);
            } catch (error) {
                // Handle error (unauthorized, network issues, etc.)
            }
        };

        fetchPurchaseRequests();
    }, []);
    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token'); // Retrieve the token
            if (token) {
                try {
                    // Fetch current user details
                    const userResponse = await axios.get('http://localhost:8000/current-user/', {
                        headers: { Authorization: `Token ${token}` },
                    });
                    setCurrentUser(userResponse.data.username); // Update state with the current user's username
                } catch (error) {
                    // Handle error, such as redirecting to the login page if unauthorized
                }
            }
        };

        fetchUserData();
        // ... existing fetchPurchaseRequests call
    }, []);
    const handleAddPurchaseRequest = () => {
        navigate('/purchas-requests'); // Adjust the path as needed
    };

    const filteredRequests = purchaseRequests.filter((request) => {
        return (
            (filterStatus === 'All' || request.status === filterStatus) &&
            (filterLocation === 'All' || request.location_required === filterLocation)
        );
    });

  
    return (
        <div style={styles.container}>
             {currentUser && (
        <div style={styles.currentUserInfo}>
          Logged in as: <strong>{currentUser}</strong>
        </div>
      )}
          <h1 style={styles.title}>Purchase Requests</h1>
          <Button color="primary" onClick={handleAddPurchaseRequest} style={styles.addButton}>
            Add Purchase Request
          </Button>
          <div style={styles.filters}>
            <FormGroup style={styles.filterGroup}>
              <Label for="filterStatus">Filter by status:</Label>
              <Input type="select" name="filterStatus" id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                {/* Add other status options here */}
              </Input>
            </FormGroup>
            <FormGroup style={styles.filterGroup}>
              <Label for="filterLocation">Filter by location required:</Label>
              <Input type="select" name="filterLocation" id="filterLocation" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                <option value="All">All</option>
                <option value="Baghdad">Baghdad</option>
                {/* Add other location options here */}
              </Input>
            </FormGroup>
          </div>
          <div style={styles.tableResponsive}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Programme</th>
                  <th>Document Reference</th>
                  <th>Purchase Request Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {filteredRequests.map((pr) => (
                <tr key={pr.id} onClick={() => navigate(`/purchas-requests/${pr.id}`)} style={{ cursor: 'pointer' }}>
                  <td>{pr.programme}</td>
                  <td>{pr.document_reference}</td>
                  <td>{new Date(pr.purchase_request_date).toLocaleDateString()}</td>
                  <td>{pr.status}</td>
                </tr>
              ))}
            </tbody>
            </Table>
          </div>
        </div>
      );
    };
    

export default PurchaseRequestList;