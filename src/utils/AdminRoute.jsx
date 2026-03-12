import React from 'react';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return <PrivateRoute>{children}</PrivateRoute>;
};

export default AdminRoute;