import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, InputGroup, Col, Row, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState({
    title: '',
    status: '',
    category: '',
    priority: '',
    assignedTo: '',
  });
  const [sortedBy, setSortedBy] = useState('date'); // default sorting by date

  useEffect(() => {
    // Fetch ticket data (replace with your API endpoint)
    axios.get('/api/tickets')
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const handleSort = (column) => {
    setSortedBy(column);
    const sortedTickets = [...tickets].sort((a, b) => {
      if (column === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return a[column].localeCompare(b[column]);
    });
    setTickets(sortedTickets);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  // Filter tickets based on the filter state (title, status, etc.)
  const filteredTickets = tickets.filter(ticket => {
    return (
      (filter.title ? ticket.title.toLowerCase().includes(filter.title.toLowerCase()) : true) &&
      (filter.status ? ticket.status.toLowerCase() === filter.status.toLowerCase() : true) &&
      (filter.category ? ticket.category.toLowerCase().includes(filter.category.toLowerCase()) : true) &&
      (filter.priority ? ticket.priority.toLowerCase() === filter.priority.toLowerCase() : true) &&
      (filter.assignedTo ? ticket.assignedTo.toLowerCase().includes(filter.assignedTo.toLowerCase()) : true)
    );
  });

  return (
    <div>
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Search Tickets</InputGroup.Text>
            <FormControl
              placeholder="Search by title"
              name="title"
              value={filter.title}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
      </Row>

      <Form>
        <Row>
          <Col md={3}>
            <Form.Control
              as="select"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Form.Control>
          </Col>

          <Col md={3}>
            <Form.Control
              type="text"
              name="category"
              placeholder="Category"
              value={filter.category}
              onChange={handleFilterChange}
            />
          </Col>

          <Col md={3}>
            <Form.Control
              as="select"
              name="priority"
              value={filter.priority}
              onChange={handleFilterChange}
            >
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Control>
          </Col>

          <Col md={3}>
            <Form.Control
              type="text"
              name="assignedTo"
              placeholder="Assigned To"
              value={filter.assignedTo}
              onChange={handleFilterChange}
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th onClick={() => handleSort('ticket_id')}>Ticket ID</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.ticket_id}</td>
                <td>{new Date(ticket.date).toLocaleDateString()}</td>
                <td>{ticket.status}</td>
                <td>{ticket.title}</td>
                <td>
                  <Link to={`/ticket/${ticket.ticket_id}`}>
                    <Button variant="info">View</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No tickets found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TicketList;
