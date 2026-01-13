// utils/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PrivateRoute from './PrivateRoute';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <PrivateRoute>{children}</PrivateRoute>;
};

export default AdminRoute;