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

const UserManagementPage = () => {
  const [users, setUsers] = useState([
    { username: 'jayadmin', email: 'jay@example.com', role: 'Admin' },
    { username: 'ivyuser', email: 'ivy@example.com', role: 'User' },
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Admin',
  });

  const [showModal, setShowModal] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [editUser, setEditUser] = useState({
    username: '',
    email: '',
    role: '',
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUser.username && newUser.email) {
      setUsers([...users, newUser]);
      setNewUser({ username: '', email: '', role: 'Admin' });
    }
  };

  const handleDeleteUser = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
    }
  };

  const handleEditClick = (index) => {
    setCurrentUserIndex(index);
    setEditUser(users[index]);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    const updatedUsers = [...users];
    updatedUsers[currentUserIndex] = editUser;
    setUsers(updatedUsers);
    setShowModal(false);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4" style={{ color: 'black' }}>User Management</h2>

          {/* Add User Form */}
          <Card className="mb-4">
            <Card.Header><strong>Add User</strong></Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddUser}>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) =>
                          setNewUser({ ...newUser, username: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                      >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Button variant="primary" type="submit" className="w-100">
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* User List Table */}
          <Card>
            <Card.Header><strong>User List</strong></Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(index)}
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
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={editUser.username}
                    onChange={(e) =>
                      setEditUser({ ...editUser, username: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default UserManagementPage;
