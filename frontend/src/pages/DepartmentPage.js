// src/pages/DepartmentPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import api from '../services/api';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (err) {
      console.error('❌ Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (newDepartment.trim() === '') return;

    try {
      await api.post('/departments', { name: newDepartment });
      setNewDepartment('');
      fetchDepartments(); // Refresh list
    } catch (err) {
      console.error('❌ Error adding department:', err);
    }
  };

  const handleEditClick = (dept) => {
    setEditingDepartment(dept.id);
    setEditedName(dept.name);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditedName('');
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) return;

    try {
      await api.put(`/departments/${editingDepartment}`, {
        name: editedName,
      });

      fetchDepartments(); // Refresh list
      setEditingDepartment(null);
      setEditedName('');
    } catch (err) {
      console.error('❌ Error saving edit:', err.response?.data || err.message);
      alert('Failed to update. Please check the backend logs.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/departments/${departmentToDelete}`);
      setShowConfirm(false);
      setDepartmentToDelete(null);
      fetchDepartments(); // Refresh list
    } catch (err) {
      console.error('❌ Error deleting department:', err.response?.data || err.message);
      alert('Failed to delete. Please check if the ID exists or if backend allows DELETE.');
    }
  };

  return (
    <div className="department-page p-4" style={{ marginLeft: '10px' }}>
      <Container fluid>
        <h2 className="mb-4">🏢 Departments</h2>

        {/* Add Department */}
        <Card className="shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0">Add New Department</h5>
          </Card.Header>
          <Card.Body>
            <Form className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              />
              <Button variant="primary" onClick={handleAddDepartment}>Add Department</Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Department List */}
        <Card className="shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Existing Departments</h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, index) => (
                    <tr key={dept.id}>
                      <td>{index + 1}</td>
                      <td>
                        {editingDepartment === dept.id ? (
                          <Form.Control
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        ) : (
                          dept.name
                        )}
                      </td>
                      <td className="d-flex gap-2">
                        {editingDepartment === dept.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={handleSaveEdit}>Save</Button>
                            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="warning" size="sm" onClick={() => handleEditClick(dept)}>Edit</Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setDepartmentToDelete(dept.id);
                                setShowConfirm(true);
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Confirm Delete Modal */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this department?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default DepartmentPage;
