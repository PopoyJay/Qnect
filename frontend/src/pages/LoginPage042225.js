import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Spinner } from 'react-bootstrap';
import api from '../services/api';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    api.post('/login', { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          window.location.href = '/dashboard';
        } else {
          setError('Invalid email or password.');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          const message = err.response.data.message || 'Invalid credentials';
          setError(message);
        } else {
          setError('Server or network error during login.');
        }
        setLoading(false);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm login-card">
        <Card.Body>
          <h3 className="text-center mb-4">🔐 Qnect Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
