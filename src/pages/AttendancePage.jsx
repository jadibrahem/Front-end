import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, Button, FormGroup, Input, Label } from 'reactstrap';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All Employees');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fetch initial data
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    let apiUrl = 'http://localhost:8000/attendance/';
    
    if (selectedDepartment !== 'All Employees') {
      apiUrl += `department/${selectedDepartment}/`;
    }

    if (selectedDate) {
      apiUrl += `daily/${selectedDate}/`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'success') {
      setAttendanceData(data.data);
    } else {
      console.error('Error fetching attendance data:', data.message);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleGetEmployeeList = () => {
    fetchAttendanceData();
  };

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
                    <Input
                      type="select"
                      name="select"
                      id="departmentSelect"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                    >
                      <option>All Employees</option>
                      <option>Department 1</option>
                      {/* ... other departments */}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="dateSelect">Date</Label>
                    <Input
                      type="date"
                      name="date"
                      id="dateSelect"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <Button color="primary" style={{ marginTop: '32px' }} onClick={handleGetEmployeeList}>
                    Get Employee List
                  </Button>
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
                    <tr key={index + 1}>
                      <th scope="row">{index + 1}</th>
                
                      <td>{data.attendance_status}</td>
                      <td>{/* Add data for 'Attendance By' */}</td>
                      <td>{data.date}</td>
                      <td>{data.time_in}</td>
                      <td>{data.time_out}</td>
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