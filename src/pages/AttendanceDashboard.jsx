import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Alert, Table } from 'reactstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    daily: {}, weekly: {}, monthly: {}, status_breakdown: [], late_trends: [], department_summary: [], absenteeism_rate: 0, most_attended_employees: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceDashboardData();
  }, []);

  const fetchAttendanceDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/attendance/dash/');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDataCard = (title, data) => (
    <Card>
      <CardBody>
        <CardTitle tag="h5">{title}</CardTitle>
        <div>Total Count: {data.total_count || 'N/A'}</div>
        <div>Total Hours: {data.total_hours || 'N/A'}</div>
        <div>Late Arrivals: {data.late_count || 'N/A'}</div>
        <div>Early Leaves: {data.early_leave_count || 'N/A'}</div>
        <div>Overtime Hours: {data.overtime_hours || 'N/A'}</div>
      </CardBody>
    </Card>
  );

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1>Attendance Dashboard</h1>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!isLoading && !error && (
            <>
              <Row>
                <Col sm={4}>{renderDataCard('Daily', dashboardData.daily)}</Col>
                <Col sm={4}>{renderDataCard('Weekly', dashboardData.weekly)}</Col>
                <Col sm={4}>{renderDataCard('Monthly', dashboardData.monthly)}</Col>
              </Row>

              {/* Late Trends Bar Chart */}
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Late Arrival Trends</CardTitle>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.late_trends}>
                          <XAxis dataKey="late_date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Status Breakdown */}
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Status Breakdown</CardTitle>
                      {/* Render status breakdown data here */}
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Department Summary */}
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Department Summary</CardTitle>
                      {/* Render department summary data here */}
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Absenteeism Rate */}
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Absenteeism Rate</CardTitle>
                      <div>{dashboardData.absenteeism_rate.toFixed(2)}%</div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Most Attended Employees Table */}
              <Row>
                <Col sm={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Top Employees by Attendance</CardTitle>
                      <Table striped>
                        <thead>
                          <tr>
                            <th>Employee Name</th>
                            <th>Attendance Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.most_attended_employees.map((employee, index) => (
                            <tr key={index}>
                              <td>{employee.employee__FirstName} {employee.employee__LastName}</td>
                              <td>{employee.total_attendance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AttendanceDashboard;