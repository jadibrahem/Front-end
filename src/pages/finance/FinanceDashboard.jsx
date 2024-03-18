import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Badge , Table} from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';

const FinanceDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
   
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/dashboard/'); // Make sure this endpoint is correct
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const prStatusDoughnutData = {
        labels: dashboardData?.pr_status_count.map(item => item.status),
        datasets: [
            {
                data: dashboardData?.pr_status_count.map(item => item.total),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            },
        ],
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">PR Status Overview</CardTitle>
                            {dashboardData && <Doughnut data={prStatusDoughnutData} />}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Counts Overview</CardTitle>
                            <p>RFQ Count: <Badge color="primary">{dashboardData?.rfq_count}</Badge></p>
                            <p>Upcoming PR Deadlines: <Badge color="warning">{dashboardData?.upcoming_pr_deadlines}</Badge></p>
                            <p>Upcoming RFQ Deadlines: <Badge color="danger">{dashboardData?.upcoming_rfq_deadlines}</Badge></p>
                            <p>Total Cost of Approved PRs: <Badge color="success">${dashboardData?.approved_pr_cost.total_cost}</Badge></p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md="98">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Recent PRs</CardTitle>
                            <ListGroup>
                                {dashboardData?.recent_prs.map(pr => (
                                    <ListGroupItem key={pr.id}>
                                        {pr.programme} - <Badge color="info">{pr.status}</Badge>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="14">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Recent RFQs</CardTitle>
                            <ListGroup>
                                {dashboardData?.recent_rfqs.map(rfq => (
                                    <ListGroupItem key={rfq.id}>
                                        {rfq.programme} - <Badge color="secondary">{rfq.reference}</Badge>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                    
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md="14">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Money Spent by Budget Line</CardTitle>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Budget Line</th>
                                        <th>Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {dashboardData?.money_spent_by_budget_line?.map((line, index) => (
                                    <tr key={index}>
                                        <td>{line['budget_line__name']}</td>
                                        <td>${line.total_cost}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="14">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Most Bought Items</CardTitle>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {dashboardData?.most_bought_items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item['item__name']}</td> {/* Ensure this key matches the backend data */}
                                        <td>{item.total_quantity}</td>
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

export default FinanceDashboard;
