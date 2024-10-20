// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const isDemoUser = (user: User | DemoUser): user is DemoUser => {
  // Tis should be better as demo users do in fact have roles but this is a temporary solution <------
  return !('role' in user);
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isDemoUser(user)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;