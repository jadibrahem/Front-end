import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
} from 'reactstrap';
import { Doughnut, Bar } from 'react-chartjs-2';

const AttendanceDashboard = () => {
  // Dummy data for charts
  const workLocationData = {
    labels: ['Home', 'Office'],
    datasets: [
      {
        data: [300, 50], // example data
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const attendanceByDepartmentData = {
    labels: ['Finance', 'IT', 'Sales', 'Human Resources', 'Marketing', 'Administration'],
    datasets: [
      {
        label: 'Attendance',
        data: [65, 59, 80, 81, 56, 55], // example data
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Example data for the top 5 employees by attendance
  const topEmployeesData = [
    { name: 'jad ibrahim', attendance: '100%' },
    { name: 'hein bekker', attendance: '97%' },
    { name: 'mustafa', attendance: '96%' },
    { name: 'Michael Brown', attendance: '95%' },
    { name: 'Jessica Davis', attendance: '94%' },
  ];

  return (
    <div className="container-fluid">
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Employee Work Location Breakdown</CardTitle>
              <div style={{ maxWidth: '200px', margin: '0 auto' }}> {/* Adjust size as needed */}
                <Doughnut data={workLocationData} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Attendance by Department</CardTitle>
              <Bar data={attendanceByDepartmentData} />
            </CardBody>
          </Card>
        </Col>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Top 5 Employees by Attendance</CardTitle>
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {topEmployeesData.map((employee, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>{employee.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        {/* Additional metrics could go here */}
      </Row>
    </div>
  );
};

export default AttendanceDashboard;