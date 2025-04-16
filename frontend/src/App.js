import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage'; 
import UserManagementPage from './pages/UserManagementPage'; 
import DepartmentPage from './pages/DepartmentPage'; 
import UserRolesPage from './pages/UserRolesPage'; 
import CategoriesPage from './pages/CategoriesPage'; 
import PrioritiesPage from './pages/PrioritiesPage';
import StatusesPage from './pages/StatusesPage'; // ✅ Added

import Sidebar from './components/Sidebar'; 
import './App.css'; 

// ✅ Protected route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div className="layout-container">
        {/* Show sidebar only when logged in */}
        {isLoggedIn && <Sidebar />}

        <div className="content" style={{ marginLeft: isLoggedIn ? '220px' : '0' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
            <Route path="/departments" element={<PrivateRoute><DepartmentPage /></PrivateRoute>} />
            <Route path="/roles" element={<PrivateRoute><UserRolesPage /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
            <Route path="/priorities" element={<PrivateRoute><PrioritiesPage /></PrivateRoute>} />
            <Route path="/statuses" element={<PrivateRoute><StatusesPage /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
