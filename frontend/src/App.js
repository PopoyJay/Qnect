// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage'; 
import UserManagementPage from './pages/UserManagementPage'; 
import DepartmentPage from './pages/DepartmentPage'; 
import UserRolesPage from './pages/UserRolesPage'; 
import CategoriesPage from './pages/CategoriesPage'; 
import PrioritiesPage from './pages/PrioritiesPage';
import StatusesPage from './pages/StatusesPage';
import TicketStatusPage from './pages/TicketStatusPage';

import Sidebar from './components/Sidebar'; 
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isLoginPage]);

  return (
    <div className="layout-container">
      {isLoggedIn && !isLoginPage && <Sidebar />}
      <div className="content" style={{ marginLeft: isLoggedIn && !isLoginPage ? '220px' : '0' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
          <Route path="/departments" element={<PrivateRoute><DepartmentPage /></PrivateRoute>} />
          <Route path="/roles" element={<PrivateRoute><UserRolesPage /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
          <Route path="/priorities" element={<PrivateRoute><PrioritiesPage /></PrivateRoute>} />
          <Route path="/statuses" element={<PrivateRoute><StatusesPage /></PrivateRoute>} />
          <Route path="/ticket-status" element={<PrivateRoute><TicketStatusPage /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
