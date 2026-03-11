import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // Adjust the path as needed

const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem("userEmail");
  
  // If a user is logged in, render the child components.
  // Otherwise, redirect to the login page.
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
