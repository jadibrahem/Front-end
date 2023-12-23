import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, Table, Alert, Spinner, Input, InputGroup, Button } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RemoteUrl } from '../instant';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${RemoteUrl}/employee/`)
      .then(response => {
        setEmployees(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
        <p>Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return <Alert color="danger">Error loading employees: {error.message}</Alert>;
  }

  return (
    <Card>
      <CardHeader className="bg-primary text-white">
        <h3 className="mb-0">Employees List</h3>
      </CardHeader>
      <CardBody>
        {/* Search and Filter Inputs (Currently non-functional placeholders) */}
        <div className="mb-3">
          <InputGroup>
            <Input placeholder="Search employees..." />
            <Button color="secondary">Search</Button>
          </InputGroup>
        </div>
        <div className="mb-3">
          <InputGroup>
            <Input type="select" name="departmentFilter" id="departmentFilter">
              <option>All Departments</option>
              <option>Department 1</option>
              <option>Department 2</option>
              {/* ... other department options */}
            </Input>
            <Button color="secondary">Filter</Button>
          </InputGroup>
        </div>

        {employees.length > 0 ? (
          <Table bordered responsive hover className="mt-3">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date Hired</th>
                <th>Date of Birth</th>
                <th>Nationality</th>
                <th>Marital Status</th>
                <th>Email</th>
                <th>Insurance Number</th>
                <th>Passport Number</th>
                <th>Profile Image</th>
              </tr>
            </thead>
            <tbody>
            {employees.map(employee => (
                <tr key={employee.EmployeeID}>
                  <td>{employee.EmployeeID}</td>
                  <td>
                    {employee.InsuranceNumber ? (
                      <Link to={`/qr-code/${employee.InsuranceNumber}`}>
                        {employee.FirstName} {employee.LastName}
                      </Link>
                    ) : (
                      <span>No Insurance Number</span>
                    )}
                  </td>
                  <td>{moment(employee.DateHired).format('YYYY-MM-DD')}</td>
                  <td>{moment(employee.DateOfBirth).format('YYYY-MM-DD')}</td>
                  <td>{employee.Nationality}</td>
                  <td>{employee.MaritalStatus}</td>
                  <td>{employee.Email}</td>
                  <td>{employee.InsuranceNumber}</td>
                  <td>{employee.PassportNumber}</td>
                  <td>
                    {employee.ProfileImage ? (
                      <img
                        src={employee.ProfileImage}
                        alt={`${employee.FirstName}'s Profile`}
                        width="50"
                        height="50"
                        className="img-fluid rounded-circle"
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert color="info">No employees found.</Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default EmployeeList;