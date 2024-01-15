import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, Button, FormGroup, Input, Label, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const formatHours = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    setError('');
    let apiUrl = 'https://halotrust.pythonanywhere.com/attendance/';

    if (selectedDepartment) {
      apiUrl += `department/${selectedDepartment}/`;
    }
    if (selectedDate) {
      apiUrl += `daily/${selectedDate}/`;
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'success') {
        setAttendanceData(data.data);
      } else {
        console.error('Error fetching attendance data:', data.message);
        setError('Error fetching attendance data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching attendance data');
    } finally {
      setIsLoading(false);
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

  const navigateToQRScanner = () => {
    navigate('/scan-qr-code'); // Navigate to the QR scanner page
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
                    <Label for="departmentSelect">Department</Label>
                    <Input
                      type="select"
                      name="select"
                      id="departmentSelect"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                    >
                      <option value="">All Departments</option>
                      <option value="1">Department 1</option>
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
                    Get Attendance Data
                  </Button>
                </Col>
              </Row>

              {isLoading && <Alert color="info">Loading...</Alert>}
              {error && <Alert color="danger">{error}</Alert>}
              {attendanceData.length === 0 && !isLoading && <Alert color="warning">No attendance records found.</Alert>}

              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Total Hours</th>
                    <th>Overtime Hours</th>
                    <th>Status</th>
                    <th>Late</th>
                    <th>Early Leave</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((attendance, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{attendance.employee.FirstName} {attendance.employee.LastName}</td>
                      <td>{attendance.date}</td>
                      <td>{attendance.time_in}</td>
                      <td>{attendance.time_out}</td>
                      <td>{formatHours(attendance.total_hours)}</td>
                      <td>{attendance.overtime_hours}</td>
                      <td>{attendance.attendance_status}</td>
                      <td>{attendance.late_flag ? 'Yes' : 'No'}</td>
                      <td>{attendance.early_leave_flag ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
            <Button color="secondary" onClick={navigateToQRScanner} style={{ margin: '10px' }}>
              Scan QR Code
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendancePage;