import React, { useState } from 'react';
import { Container, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const UserRolesPage = () => {
  const [roles, setRoles] = useState(['Admin', 'Support', 'Agent']);
  const [newRole, setNewRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddRole = () => {
    if (newRole.trim() === '') return;
    if (editIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[editIndex] = newRole;
      setRoles(updatedRoles);
      setEditIndex(null);
    } else {
      setRoles([...roles, newRole]);
    }
    setNewRole('');
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setNewRole(roles[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      const updatedRoles = [...roles];
      updatedRoles.splice(index, 1);
      setRoles(updatedRoles);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4 text-dark">User Roles Management</h2>

          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>User Roles</span>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Role
              </Button>
            </Card.Header>
            <Card.Body>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Role Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{role}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(index)} className="me-2">
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(index)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>

        {/* Modal for Add/Edit */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editIndex !== null ? 'Edit Role' : 'Add Role'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddRole}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserRolesPage;
