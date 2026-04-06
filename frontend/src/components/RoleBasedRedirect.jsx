import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * RoleBasedRedirect Component
 * Redirects users to appropriate homepage based on their role
 * 
 * Used on the main homepage (/) to send:
 * - Owners → Owner Dashboard
 * - Tenants → Tenant Homepage (Browse Rooms)
 */
const RoleBasedRedirect = ({ children }) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If user is logged in, redirect based on role
    if (user) {
      const userRole = user.role || 'user';

      if (userRole === 'owner') {
        // Owner → Dashboard
        navigate('/owner-dashboard', { replace: true });
      }
      // Tenants stay on homepage to browse rooms
    }
  }, [user, loading, navigate]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Render homepage for guests and tenants
  return <>{children}</>;
};

export default RoleBasedRedirect;
