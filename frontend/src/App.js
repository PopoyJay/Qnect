import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage'; // ✅ Add this import

// ✅ Simple protected route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
};

export default App;
