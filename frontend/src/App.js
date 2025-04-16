import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import UserManagementPage from './pages/UserManagementPage';
import UserRolesPage from './pages/UserRolesPage'; // ✅ Import UserRolesPage
import Sidebar from './components/Sidebar';
import './App.css';

// ✅ Simple protected route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ✅ Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* ✅ Protected Tickets Route */}
            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <TicketsPage />
                </PrivateRoute>
              }
            />

            {/* ✅ Protected User Management Route */}
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserManagementPage />
                </PrivateRoute>
              }
            />

            {/* ✅ Protected User Roles Route */}
            <Route
              path="/roles"
              element={
                <PrivateRoute>
                  <UserRolesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
