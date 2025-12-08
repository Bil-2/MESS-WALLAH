import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute Component
 * Restricts access based on user authentication and role
 * 
 * Props:
 * - children: Component to render if authorized
 * - allowedRoles: Array of roles allowed (e.g., ['student', 'owner'])
 * - requireAuth: Boolean, whether authentication is required
 */
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    // Not logged in, redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      // User doesn't have required role

      // If owner trying to access tenant routes, redirect to owner dashboard
      if (userRole === 'owner') {
        return <Navigate to="/owner-dashboard" replace />;
      }

      // If tenant trying to access owner routes, redirect to rooms
      if (userRole === 'student' || userRole === 'user') {
        return <Navigate to="/rooms" replace />;
      }

      // Fallback to home
      return <Navigate to="/" replace />;
    }
  }

  // User is authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
