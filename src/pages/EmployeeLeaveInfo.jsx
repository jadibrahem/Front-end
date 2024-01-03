import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './leaveinfo.css'; // Import the CSS file for styling

const EmployeeLeaveInfo = () => {
    const [leaveData, setLeaveData] = useState({ leave_requests: [], LeaveDetails: {}, TakenLeaves: 0, RemainingLeaves: 0 });
    const [error, setError] = useState('');
    const { insuranceNumber } = useParams();

    useEffect(() => {
        axios.get(`https://halotrust.pythonanywhere.com/employee/${insuranceNumber}/leaves/`)
            .then(response => {
                setLeaveData(response.data);
            })
            .catch(() => {
                setError('Error fetching leave data');
            });
    }, [insuranceNumber]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!leaveData.leave_requests.length) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="leave-info-container">
            <h2>Leave Requests</h2>
            <table className="leave-requests-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Employee Name</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveData.leave_requests.map(leave => (
                        <tr key={leave.id}>
                            <td>{leave.LeaveType}</td>
                            <td>{leave.StartDate}</td>
                            <td>{leave.EndDate}</td>
                            <td>{leave.Reason}</td>
                            <td>{leave.Status}</td>
                            <td>{leave.employee_name}</td>
                            <td>{leave.position_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="leave-allocation">
                <h2>Leave Allocation</h2>
                <div className="leave-details">
                    {Object.entries(leaveData.LeaveDetails).map(([type, days]) => (
                        <p key={type}>{type}: <span>{days}</span></p>
                    ))}
                </div>
                <p>Taken Leaves: <span>{leaveData.TakenLeaves}</span></p>
                <p>Remaining Leaves: <span>{leaveData.RemainingLeaves}</span></p>
            </div>
        </div>
    );
};

export default EmployeeLeaveInfo;