import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import '../styles/dark-theme.css';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  // State for search term and status filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample ticket data (you can replace this with real data later)
  const tickets = [
    { id: 1, subject: 'Login issue', status: 'Pending', priority: 'High', assignedTo: 'Jay Cabrera', date: '2025-04-14' },
    { id: 2, subject: 'POS Sync Delay', status: 'Resolved', priority: 'Low', assignedTo: 'Ivy Tech', date: '2025-04-13' },
    { id: 3, subject: 'Password Reset', status: 'In Progress', priority: 'Medium', assignedTo: 'Miko Admin', date: '2025-04-12' },
  ];

  // Filtered tickets logic
  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'All' || ticket.status === statusFilter)
  );

  return (
    <div className="dashboard-container d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 p-4" style={{ marginLeft: '220px' }}>
        <Container fluid>
          <h2 className="text-light mb-4">Welcome to Qnect Dashboard</h2>

          {/* Dashboard Stats */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="bg-dark text-light shadow-sm">
                <Card.Body>
                  <h5>Total Tickets</h5>
                  <p className="fs-4 fw-bold">120</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark text-light shadow-sm">
                <Card.Body>
                  <h5>Pending Tickets</h5>
                  <p className="fs-4 fw-bold">34</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark text-light shadow-sm">
                <Card.Body>
                  <h5>Resolved Today</h5>
                  <p className="fs-4 fw-bold">12</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Tickets with Search and Filter */}
          <Card className="bg-dark text-light shadow-sm">
            <Card.Header>
              <h5>Recent Tickets</h5>
            </Card.Header>
            <Card.Body>
              {/* Search and Filter */}
              <Form className="mb-3">
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Search tickets"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="In Progress">In Progress</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>

              {/* Tickets Table */}
              <div className="table-responsive">
                <table className="table table-dark table-hover table-striped align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td>
                          <span className={`badge bg-${ticket.status === 'Resolved' ? 'success' : ticket.status === 'Pending' ? 'warning' : 'info'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${ticket.priority === 'High' ? 'danger' : ticket.priority === 'Medium' ? 'warning' : 'secondary'}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>{ticket.assignedTo}</td>
                        <td>{ticket.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>

        </Container>
      </div>
    </div>
  );
};

export default DashboardPage;
