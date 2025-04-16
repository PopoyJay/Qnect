import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormControl, InputGroup, Table, Button } from 'react-bootstrap'; // ✅ Added Button import
import axios from 'axios';

const TicketStatusPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState({
    status: '',
    category: '',
    priority: '',
    department: '',
    assignedTo: ''
  });

  useEffect(() => {
    // Fetch ticket data (replace with your actual API endpoint)
    axios.get('/api/tickets')  // Replace with your actual API endpoint
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    return (
      (filter.status ? ticket.status.toLowerCase() === filter.status.toLowerCase() : true) &&
      (filter.category ? ticket.category.toLowerCase().includes(filter.category.toLowerCase()) : true) &&
      (filter.priority ? ticket.priority.toLowerCase() === filter.priority.toLowerCase() : true) &&
      (filter.department ? ticket.department.toLowerCase().includes(filter.department.toLowerCase()) : true) &&
      (filter.assignedTo ? ticket.assignedTo.toLowerCase().includes(filter.assignedTo.toLowerCase()) : true)
    );
  });

  return (
    <Container>
      <Row className="my-4">
        {/* Status Filter */}
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Status</InputGroup.Text>
            <FormControl
              as="select"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </InputGroup>
        </Col>

        {/* Category Filter */}
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Category</InputGroup.Text>
            <FormControl
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              placeholder="Category"
            />
          </InputGroup>
        </Col>

        {/* Priority Filter */}
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Priority</InputGroup.Text>
            <FormControl
              as="select"
              name="priority"
              value={filter.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </FormControl>
          </InputGroup>
        </Col>

        {/* Department Filter */}
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Department</InputGroup.Text>
            <FormControl
              name="department"
              value={filter.department}
              onChange={handleFilterChange}
              placeholder="Department"
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="my-4">
        {/* Assigned To Filter */}
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Assigned To</InputGroup.Text>
            <FormControl
              name="assignedTo"
              value={filter.assignedTo}
              onChange={handleFilterChange}
              placeholder="Assigned To"
            />
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map(ticket => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.ticket_id}</td>
              <td>{new Date(ticket.date).toLocaleDateString()}</td>
              <td>{ticket.status}</td>
              <td>{ticket.title}</td>
              <td>
                <Button variant="info">View</Button> {/* Updated to use Button component */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TicketStatusPage;
