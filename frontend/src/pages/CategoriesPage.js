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

const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { name: 'IT Support' },
    { name: 'Customer Service' },
    { name: 'Maintenance' },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(null);
  const [editCategory, setEditCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory) {
      setCategories([...categories, { name: newCategory }]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    }
  };

  const handleEditClick = (index) => {
    setCurrentCategoryIndex(index);
    setEditCategory(categories[index].name);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    const updatedCategories = [...categories];
    updatedCategories[currentCategoryIndex].name = editCategory;
    setCategories(updatedCategories);
    setShowModal(false);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4" style={{ color: 'black' }}>Categories</h2>

          {/* Add Category Form */}
          <Card className="mb-4">
            <Card.Header><strong>Add Category</strong></Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddCategory}>
                <Row className="align-items-end">
                  <Col md={10}>
                    <Form.Group controlId="category">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                      />
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

          {/* Categories List Table */}
          <Card>
            <Card.Header><strong>Category List</strong></Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(index)}
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
              <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />
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

export default CategoriesPage;
