import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from 'reactstrap';

const ProjectTables = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/employee/')
      .then(response => {
        setEmployees(response.data); // handle success
      })
      .catch(error => {
        console.error('There was an error fetching the employee data:', error); // handle error
      });
  }, []);

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Employee Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the Employees
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Insurance Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Nationality</th>
                <th>Profile Image</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.EmployeeID}>
                  <td>{employee.InsuranceNumber}</td>
                  <td>{`${employee.FirstName} ${employee.LastName}`}</td>
                  <td>{employee.Email}</td>
                  <td>{employee.Nationality}</td>
                  <td>
                    {employee.ProfileImage && (
                      <img
                        src={employee.ProfileImage}
                        className="rounded-circle"
                        alt={`${employee.FirstName}'s profile`}
                        width="45"
                        height="45"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectTables;