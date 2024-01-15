import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, Spinner } from 'reactstrap';

const TeamDetailsPage = () => {
    const [teamData, setTeamData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/teams/details/')
            .then(response => {
                setTeamData(response.data);
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
                <p>Loading team details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert color="danger">
                Error loading team details: {error.message || 'An error occurred'}
            </Alert>
        );
    }

    return (
        <div>
            <h1>Team Details</h1>
            {teamData.map(team => (
                <div key={team.id}>
                    <h2>{team.name} - {team.team_type.name}</h2>
                    <Table bordered responsive hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Member ID</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.members.map(member => (
                                <tr key={member.id}>
                                    <td>{member.employee.id}</td>
                                    <td>{member.employee.FirstName} {member.employee.LastName}</td>
                                    <td>{member.position.Name}</td>
                                    <td>{member.team_role.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ))}
                          </div>
   );
};

export default TeamDetailsPage;