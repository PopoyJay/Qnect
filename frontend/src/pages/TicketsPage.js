import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TicketCreationForm from '../components/TicketCreationForm';
import '../styles/dark-theme.css';

const TicketsPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 p-4" style={{ marginLeft: '220px' }}>
        <Container fluid>
          <h2 className="text-light mb-4">Create a New Ticket</h2>
          <Row>
            <Col md={12}>
              <Card className="bg-dark text-light shadow-sm">
                <Card.Body>
                  <TicketCreationForm />
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
