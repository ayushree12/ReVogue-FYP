import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RoleGuard;
