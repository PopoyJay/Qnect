import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Modal,
} from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const PrioritiesPage = () => {
  const [priorities, setPriorities] = useState([
    { name: 'High' },
    { name: 'Medium' },
    { name: 'Low' },
  ]);

  const [newPriority, setNewPriority] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editPriority, setEditPriority] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newPriority.trim()) {
      setPriorities([...priorities, { name: newPriority }]);
      setNewPriority('');
    }
  };

  const handleDelete = (index) => {
    const confirm = window.confirm("Delete this priority?");
    if (confirm) {
      const updated = [...priorities];
      updated.splice(index, 1);
      setPriorities(updated);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditPriority(priorities[index].name);
    setShowModal(true);
  };

  const handleSave = () => {
    const updated = [...priorities];
    updated[editIndex].name = editPriority;
    setPriorities(updated);
    setShowModal(false);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4" style={{ color: 'black' }}>Priorities</h2>

          <Card className="mb-4">
            <Card.Header><strong>Add Priority</strong></Card.Header>
            <Card.Body>
              <Form onSubmit={handleAdd}>
                <Row className="align-items-end">
                  <Col md={10}>
                    <Form.Group controlId="priorityName">
                      <Form.Label>Priority Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter priority name"
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Button type="submit" variant="primary" className="w-100">
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header><strong>Priority List</strong></Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Priority Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {priorities.map((priority, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{priority.name}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 text-white"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Edit Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Priority</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Priority Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default PrioritiesPage;
