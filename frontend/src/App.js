import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage'; 
import UserManagementPage from './pages/UserManagementPage'; 
import DepartmentPage from './pages/DepartmentPage'; // Add DepartmentPage import
import UserRolesPage from './pages/UserRolesPage'; // Add UserRolesPage import
import Sidebar from './components/Sidebar'; 
import './App.css'; 

// ✅ Simple protected route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div className="layout-container">
        {/* Only render Sidebar if the user is logged in */}
        {isLoggedIn && <Sidebar />}

        {/* Main Content Area */}
        <div className="content" style={{ marginLeft: isLoggedIn ? '220px' : '0' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <TicketsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserManagementPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <PrivateRoute>
                  <DepartmentPage />
                </PrivateRoute>
              }
            />
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
