import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedDepartments }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user !== null;
  const userDepartment = user ? user.department : null;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedDepartments && !allowedDepartments.includes(userDepartment)) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
