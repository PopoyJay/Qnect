import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Table, Modal,
} from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

// Empty user template
const emptyUser = Object.freeze({
  username: '',
  email: '',
  role: '',
  password: '',
});

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ ...emptyUser });
  const [editUser, setEditUser] = useState({ ...emptyUser });
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setNewUser({ ...emptyUser }); // reset on load
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) return;

    try {
      await api.post('/users', newUser);
      setNewUser({ ...emptyUser });
      setShowPassword(false);
      fetchUsers();
    } catch (err) {
      console.error('❌ Error adding user:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('❌ Error deleting user:', err);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUserId(user.id);
    setEditUser({ username: user.username, email: user.email, role: user.role, password: '' });
    setShowModal(true);
  };

  const saveUser = async (id, userData) => {
    try {
      const res = await api.put(`/users/${id}`, userData);
      if (res.status === 200) {
        alert('User updated!');
        setShowModal(false);
        fetchUsers();
      } else {
        alert('Failed to update user.');
      }
    } catch (err) {
      console.error('❌ Error saving user:', err);
    }
  };

  const handleSaveEdit = () => {
    saveUser(currentUserId, editUser); // Call the saveUser function
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
                <Row className="align-items-end g-3">
                  <Col md={3}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ms-2"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Support">Support</option>
                        <option value="Agent">Agent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Button type="submit" className="w-100" variant="primary">Add</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* User Table */}
          <Card>
            <Card.Header><strong>User List</strong></Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : (
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
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Edit User Modal */}
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
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="Support">Support</option>
                    <option value="Agent">Agent</option>
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
