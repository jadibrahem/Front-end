import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
const LeaveDetailsPage = () => {
    const [leaveData, setLeaveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace '/api/leave-details' with your actual API endpoint
        axios.get('http://127.0.0.1:8000/employee-leave-info/')
            .then(response => {
                setLeaveData(response.data);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner color="primary" />
                <p>Loading leave details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert color="danger">
                Error loading leave details: {error.message || 'An error occurred'}
            </Alert>
        );
    }

    return (
        <div>
            <h1>Leave Details</h1>
            <Table bordered responsive hover className="mt-3">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Sick Leave</th>
                        <th>Paid Leave</th>
                        <th>Unpaid Leave</th>
                        <th>Taken Leaves</th>
                        <th>Remaining Leaves</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveData.map(employee => (
                        <tr key={employee.EmployeeID}>
                            <td>{employee.EmployeeID}</td>
                            <td>{employee.Name}</td>
                            <td>{employee.LeaveDetails['Sick Leave']}</td>
                            <td>{employee.LeaveDetails['paid leave']}</td>
                            <td>{employee.LeaveDetails['Unpaid Leave']}</td>
                            <td>{employee.TakenLeaves}</td>
                            <td>{employee.RemainingLeaves}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-center mt-4">
                <Link to="/leave-request">
                    <Button color="primary">Leave Request Form</Button>
                </Link>
            </div>
        </div>
    );
};

export default LeaveDetailsPage;