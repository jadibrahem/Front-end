import React, { useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, Button, FormGroup, Input, Label } from 'reactstrap';

const AttendancePage = () => {
  // Example state for attendance data
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Deepak', type: 'manual', by: 'DevD', date: '07/05/2020', inTime: '09:00', outTime: '17:31', status: 'Present' },
    { id: 2, name: 'John', type: 'manual', by: 'DevD', date: '07/05/2020', inTime: '09:00', outTime: '09:42', status: 'Present' },
    // ... other data
  ]);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>Daily Attendance</CardHeader>
            <CardBody>
              <Row form>
                <Col md={3}>
                  <FormGroup>
                    <Label for="departmentSelect">Employees By Department</Label>
                    <Input type="select" name="select" id="departmentSelect">
                      <option>All Employees</option>
                      <option>Department 1</option>
                      {/* ... other departments */}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="dateSelect">Date</Label>
                    <Input type="date" name="date" id="dateSelect" />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <Button color="primary" style={{ marginTop: '32px' }}>Get Employee List</Button>
                </Col>
              </Row>

              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Attendance Type</th>
                    <th>Attendance By</th>
                    <th>Date</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((data, index) => (
                    <tr key={data.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{data.name}</td>
                      <td>{data.type}</td>
                      <td>{data.by}</td>
                      <td>{data.date}</td>
                      <td>{data.inTime}</td>
                      <td>{data.outTime}</td>
                      <td>{data.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendancePage;