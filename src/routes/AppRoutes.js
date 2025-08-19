import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/Admindashboard';
import UserDashboard from '../pages/user/Userdashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user/*" element={
        <ProtectedRoute role="USER">
          <UserDashboard />
        </ProtectedRoute>
      } />

      {/* Default */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
