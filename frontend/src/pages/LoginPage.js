import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/dark-theme.css'; // make sure this path is correct

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect with your backend login API
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="login-page dark-theme">
      <Container>
        <Row className="justify-content-md-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <Card className="shadow login-card">
              <Card.Body>
              <div className="text-center mb-4">
              <img 
                src="/assets/qnect-logo.png" 
                alt="Qnect Logo" 
                className="qnect-logo animate-logo"
                style={{ height: '80px' }}
              />
              <h2 className="mt-3 text-light">Qnect</h2>
              </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label className="text-light">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-4">
                    <Form.Label className="text-light">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
