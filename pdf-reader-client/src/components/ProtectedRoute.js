import React from "react";
import { Navigate } from "react-router-dom";

// Protected Route component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the children components (e.g., FileUpload, QuestionPage)
  return children;
};

export default ProtectedRoute;
