import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, InputGroup, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('');
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
    setFilter(event.target.value);
  };

  const filteredTickets = tickets.filter(ticket => {
    return ticket.title.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Search Tickets</InputGroup.Text>
            <FormControl
              placeholder="Search by title"
              value={filter}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
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
          {filteredTickets.map(ticket => (
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
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TicketList;
