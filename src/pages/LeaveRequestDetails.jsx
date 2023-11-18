import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem, Button, Alert, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';

const LeaveRequestDetails = () => {
    const [leaveRequest, setLeaveRequest] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/leave/${id}/`)
            .then(response => {
                setLeaveRequest(response.data);
                setNewStatus(response.data.Status);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching leave request details: ' + error.message);
                setLoading(false);
            });
    }, [id]);

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const updateLeaveStatus = () => {
        axios.put(`http://127.0.0.1:8000/leave/${id}/`, { ...leaveRequest, Status: newStatus })
            .then(response => {
                alert("Leave status updated successfully!");
                navigate('/leave-requests'); // Redirect to the leave requests list
            })
            .catch(error => {
                alert('Error updating leave status: ' + error.message);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <Alert color="danger">{error}</Alert>;
    }

    return (
        <Card>
            <CardBody>
                <CardTitle tag="h5">Leave Request Details</CardTitle>
                <ListGroup flush>
                    <ListGroupItem><strong>Employee Name:</strong> {leaveRequest.employee_name}</ListGroupItem>
                    <ListGroupItem><strong>Position:</strong> {leaveRequest.position_name}</ListGroupItem>
                    <ListGroupItem><strong>Leave Type:</strong> {leaveRequest.LeaveType}</ListGroupItem>
                    <ListGroupItem><strong>Start Date:</strong> {moment(leaveRequest.StartDate).format('YYYY-MM-DD')}</ListGroupItem>
                    <ListGroupItem><strong>End Date:</strong> {moment(leaveRequest.EndDate).format('YYYY-MM-DD')}</ListGroupItem>
                    <ListGroupItem><strong>Reason for Leave:</strong> {leaveRequest.Reason}</ListGroupItem>
                    <FormGroup>
                        <Label for="statusSelect"><strong>Status:</strong></Label>
                        <Input type="select" name="status" id="statusSelect" value={newStatus} onChange={handleStatusChange}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Input>
                    </FormGroup>
                </ListGroup>
                <Button color="primary" onClick={updateLeaveStatus}>Update Status</Button>
            </CardBody>
        </Card>
    );
};

export default LeaveRequestDetails;