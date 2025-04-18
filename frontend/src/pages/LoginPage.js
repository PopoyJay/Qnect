import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Spinner } from 'react-bootstrap';
import api from '../services/api';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // ✅ Added username state
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
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
        if (err.response) {
          if (err.response.status === 400) {
            const message = err.response.data.message || 'Invalid credentials';
            setError(message);
          } else {
            setError('Server error during login.');
          }
        } else {
          setError('Network error, please try again.');
        }
        setLoading(false);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    api.post('/register', { email, password, username, role }) // ✅ Sent username
      .then(() => {
        setError('');
        alert('Registration successful!');
        setIsRegistering(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Server error during registration.');
        setLoading(false);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm login-card">
        <Card.Body>
          <h3 className="text-center mb-4">{isRegistering ? '📋 Qnect Register' : '🔐 Qnect Login'}</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={isRegistering ? handleRegister : handleLogin}>
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

            {/* ✅ Show username field only when registering */}
            {isRegistering && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : isRegistering ? 'Register' : 'Login'}
            </Button>
          </Form>

          <div className="mt-3 text-center">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(false)}>
                  Login here
                </Button>
              </p>
            ) : (
              <p>
                Don’t have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(true)}>
                  Register here
                </Button>
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
