import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Badge, Container, Typography, Paper, Button } from '@mui/material';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';


const LeaveRequestsList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://halotrust.pythonanywhere.com/leave/')
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
        const colorMap = {
            approved: 'success',
            pending: 'warning',
            rejected: 'error',
        };
        return colorMap[status] || 'default';
    };

    const handleViewDetails = (leaveId) => {
        navigate(`/leavepdf/${leaveId}`);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Leave Requests
            </Typography>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <List>
                    {leaveRequests.map((leave) => (
                        <ListItem key={leave.id} divider>
                            <ListItemText
                                primary={
                                    <Link to={`/leave-requests/${leave.id}`} style={{ textDecoration: 'none' }}>
                                        {leave.employee_name} - {leave.position_name}
                                    </Link>
                                }
                                secondary={`Leave Type: ${leave.LeaveType} - Days: ${calculateDays(leave.StartDate, leave.EndDate)} - Reason: ${leave.Reason}`}
                            />
                            <Badge badgeContent={leave.Status} color={getStatusBadge(leave.Status) } />
                            <Button variant="contained" color="primary" onClick={() => handleViewDetails(leave.id)}>
                                View Details
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default LeaveRequestsList;