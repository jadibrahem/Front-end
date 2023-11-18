import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import moment from 'moment'; // Ensure moment is installed
import { Link } from 'react-router-dom';

const LeaveRequestsList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/leave/')
            .then(response => {
                setLeaveRequests(response.data);
            })
            .catch(error => {
                console.error('Error fetching leave requests:', error);
            });
    }, []);

    const calculateDays = (start, end) => {
        return moment(end).diff(moment(start), 'days') + 1;
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            approved: 'success',
            pending: 'warning',
            rejected: 'danger',
        };
        return statusColors[status] || 'secondary';
    };

    return (
        <ListGroup style={{ fontFamily: 'Roboto, sans-serif' }}>
            {leaveRequests.map((leave) => (
                <ListGroupItem key={leave.id}>
                    <Link to={`/leave-requests/${leave.id}`}>
                        <h5>{leave.employee_name} - {leave.position_name}</h5>
                    </Link>
                    <p>Leave Type: {leave.LeaveType}</p>
                    <p>Days of Leave: {calculateDays(leave.StartDate, leave.EndDate)}</p>
                    <p>Reason: {leave.Reason}</p>
                    <Badge color={getStatusBadge(leave.Status)}>{leave.Status}</Badge>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
};

export default LeaveRequestsList;