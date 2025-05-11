
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'customer' | 'staff' | 'admin'>;
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-green"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If roles are specified and user doesn't have the required role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect customers to customer dashboard
    if (userRole === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    // Redirect staff/admin to staff dashboard
    return <Navigate to="/" replace />;
  }

  // If user has the right role or no role is required
  return <Outlet />;
};

export default ProtectedRoute;
