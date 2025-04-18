import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import api from '../services/api';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === '') return;

    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories(); // ✅ re-fetch the updated list
    } catch (err) {
      console.error('❌ Error adding category:', err.response?.data || err.message);
    }
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat.id);
    setEditedName(cat.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  const handleSaveEdit = async () => {
    if (editedName.trim() === '') return;

    try {
      await api.put(`/categories/${editingCategory}`, { name: editedName });
      fetchCategories(); // ✅ refresh list after save
      setEditingCategory(null);
      setEditedName('');
    } catch (err) {
      console.error('❌ Error saving edit:', err.response?.data || err.message);
      alert('Failed to update category.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${categoryToDelete}`);
      fetchCategories(); // ✅ refresh list after delete
      setShowConfirm(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('❌ Error deleting category:', err.response?.data || err.message);
      alert('Failed to delete category.');
    }
  };

  return (
    <div className="category-page p-4" style={{ marginLeft: '10px' }}>
      <Container fluid>
        <h2 className="mb-4">📂 Categories</h2>

        {/* Add Category */}
        <Card className="shadow-sm mb-4">
          <Card.Header>
            <h5 className="mb-0">Add New Category</h5>
          </Card.Header>
          <Card.Body>
            <Form className="d-flex gap-2" onSubmit={handleAddCategory}>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="submit" variant="primary">Add Category</Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Category List */}
        <Card className="shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Existing Categories</h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat.id}>
                      <td>{index + 1}</td>
                      <td>
                        {editingCategory === cat.id ? (
                          <Form.Control
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="d-flex gap-2">
                        {editingCategory === cat.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={handleSaveEdit}>Save</Button>
                            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="warning" size="sm" onClick={() => handleEditClick(cat)}>Edit</Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setCategoryToDelete(cat.id);
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
          <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default CategoryPage;
