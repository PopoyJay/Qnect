import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const TicketCreationForm = ({ onCreate }) => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('Low');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: Date.now(),
      subject,
      status: 'Pending',
      priority,
      assignedTo: 'Unassigned',
      date: new Date().toISOString().split('T')[0]
    };
    onCreate(newTicket);
    setSubject('');
    setPriority('Low');
  };

  return (
    <Card className="bg-dark text-light mb-4 shadow-sm">
      <Card.Body>
        <h5>Create New Ticket</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSubject" className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ticket subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPriority" className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Ticket
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TicketCreationForm;
