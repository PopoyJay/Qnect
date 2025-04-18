import React from 'react';
import {
  Container,
  Table
} from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const StatusesPage = () => {
  // Static statuses list
  const statuses = [
    { name: 'Open' },
    { name: 'In Progress' },
    { name: 'Closed' },
    { name: 'On Hold' },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '10px' }}>
        <Container fluid>
          <h2 className="mb-4" style={{ color: 'black' }}>Statuses</h2>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Status Name</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{status.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
};

export default StatusesPage;
