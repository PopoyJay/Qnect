import React from 'react';
import {
  Container,
  Table
} from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const PrioritiesPage = () => {
  // Static priorities list with "Urgent" added
  const priorities = [
    { name: 'Urgent' },
    { name: 'High' },
    { name: 'Medium' },
    { name: 'Low' },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4" style={{ color: 'black' }}>Priorities</h2>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Priority Name</th>
              </tr>
            </thead>
            <tbody>
              {priorities.map((priority, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{priority.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
};

export default PrioritiesPage;
