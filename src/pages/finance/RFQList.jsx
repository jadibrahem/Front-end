import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

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

const RFQList = () => {
    const [rfqs, setRFQs] = useState([]);
    const [filterProgramme, setFilterProgramme] = useState('All');
    const [filterSupplier, setFilterSupplier] = useState('All');
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const fetchRFQs = async () => {
            const token = sessionStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/quotation-requests/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setRFQs(response.data);
            } catch (error) {
                console.error('Error fetching RFQs:', error);
            }
        };

        fetchRFQs();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const userResponse = await axios.get('http://localhost:8000/current-user/', {
                        headers: { Authorization: `Token ${token}` },
                    });
                    setCurrentUser(userResponse.data.username);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleAddRFQ = () => {
        navigate('/rfq-form');
    };

    const filteredRFQs = rfqs.filter((rfq) => {
        return (
            (filterProgramme === 'All' || rfq.programme === filterProgramme) &&
            (filterSupplier === 'All' || rfq.supplier.name === filterSupplier)
        );
    });

    return (
        <div style={styles.container}>
            {currentUser && (
                <div style={styles.currentUserInfo}>
                    Logged in as: <strong>{currentUser}</strong>
                </div>
            )}
            <h1 style={styles.title}>RFQ List</h1>
            <Button color="primary" onClick={handleAddRFQ} style={styles.addButton}>
                Add RFQ
            </Button>
            <div style={styles.filters}>
                <FormGroup style={styles.filterGroup}>
                    <Label for="filterProgramme">Filter by Programme:</Label>
                    <Input type="select" name="filterProgramme" id="filterProgramme" value={filterProgramme} onChange={(e) => setFilterProgramme(e.target.value)}>
                        <option value="All">All</option>
                        {/* Dynamically populate programme options here */}
                    </Input>
                </FormGroup>
                <FormGroup style={styles.filterGroup}>
                    <Label for="filterSupplier">Filter by Supplier:</Label>
                    <Input type="select" name="filterSupplier" id="filterSupplier" value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
                        <option value="All">All</option>
                        {/* Dynamically populate supplier options here */}
                    </Input>
                </FormGroup>
            </div>
            <div style={styles.tableResponsive}>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Programme</th>
                            <th>Submission Date</th>
                            <th>Supplier</th>
                            <th>Quotation Required By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRFQs.map((rfq) => (
                            <tr key={rfq.id} onClick={() => navigate(`/rfq-detail/${rfq.id}`)} style={{ cursor: 'pointer' }}>
                                <td>{rfq.reference}</td>
                                <td>{rfq.programme}</td>
                                <td>{new Date(rfq.submission_date).toLocaleDateString()}</td>
                                <td>{rfq.supplier.name}</td>
                                <td>{new Date(rfq.quotation_required_by).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default RFQList;