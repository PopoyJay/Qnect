import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar d-flex flex-column p-3 text-light">
      <h3 className="text-center mb-4">Qnect</h3>
      <Nav className="flex-column">
        <Nav.Item>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            🏠 Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/tickets"
            className={`nav-link ${location.pathname === '/tickets' ? 'active' : ''}`}
          >
            🎫 Tickets
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/settings"
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            ⚙️ Settings
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/login" className="nav-link mt-5 text-danger">
            🔒 Logout
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
<li className="nav-item">
  <Link to="/tickets" className="nav-link">
    <i className="bi bi-card-list me-2"></i>
    Tickets
  </Link>
</li>
export default Sidebar;
