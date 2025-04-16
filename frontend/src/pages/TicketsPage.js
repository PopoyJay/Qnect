import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const TicketsPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: '',
    department: '',
    status: '',
    assignedTo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ticket Submitted:', formData);
    alert('Ticket created successfully!');
    setFormData({
      subject: '',
      description: '',
      category: '',
      priority: '',
      department: '',
      status: '',
      assignedTo: '',
    });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 p-4" style={{ marginLeft: '10px', }}>
        <Container fluid>
          <h2 className="text-dark mb-4">Create New Ticket</h2>
          <Row>
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Support">Support</option>
                        <option value="Network">Network</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Assigned To</Form.Label>
                      <Form.Control
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Submit Ticket
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TicketsPage;
