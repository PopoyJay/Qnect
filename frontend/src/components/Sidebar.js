import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar d-flex flex-column p-3 text-light">
      <h3 className="text-center mb-4">Qnect</h3>
      <Nav className="flex-column">

        {/* === OVERVIEW SECTION === */}
        <div className="text-uppercase fw-bold small text-secondary mt-2 mb-1 px-2">Overview</div>
        <Nav.Item>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            🏠 Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/tickets" className={`nav-link ${isActive('/tickets')}`}>
            🎫 Create Tickets
          </Link>
        </Nav.Item>
        {/* Add the Ticket Status link here */}
        <Nav.Item>
          <Link to="/ticket-status" className={`nav-link ${isActive('/ticket-status')}`}>
            🗂️ Ticket Status
          </Link>
        </Nav.Item>

        {/* === ADMINISTRATION SECTION === */}
        <div className="text-uppercase fw-bold small text-secondary mt-4 mb-1 px-2">Administration</div>
        <Nav.Item>
          <Link to="/users" className={`nav-link ${isActive('/users')}`}>
            👤 Users
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/roles" className={`nav-link ${isActive('/roles')}`}>
            🛡️ User Roles
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/departments" className={`nav-link ${isActive('/departments')}`}>
            🏢 Departments
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/categories" className={`nav-link ${isActive('/categories')}`}>
            🗂️ Categories
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/priorities" className={`nav-link ${isActive('/priorities')}`}>
            🚦 Priorities
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/statuses" className={`nav-link ${isActive('/statuses')}`}>
            📌 Statuses
          </Link>
        </Nav.Item>

        {/* === LOGOUT === */}
        <Nav.Item className="mt-5">
          <Link to="/login" className="nav-link text-danger">
            🔒 Logout
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
