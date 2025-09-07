import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

/**
 * ProtectedRoute component for handling authentication and authorization
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Child components to render if authorized
 * @param {boolean} [requireAdmin] - If true, requires admin privileges
 * @param {boolean} [requireAuth] - If true, requires any authenticated user (for admission/contact)
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireAuth = false 
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const loginPath = isAdminRoute ? '/admin/login' : '/login';
  const from = location.state?.from?.pathname || location.pathname || '/';
  const hasRedirected = useRef(false);
  const redirectTimeout = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if admin access is required
  if (requireAdmin) {
    if (!user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        return <Navigate to={loginPath} state={{ from: location }} replace />;
      }
      return null;
    }
    
    if (!isAdmin) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        toast.error('Admin access required');
        // Use a timeout to prevent navigation loops
        redirectTimeout.current = setTimeout(() => {
          navigate('/', { replace: true });
        }, 0);
      }
      return null;
    }
    return children;
  }

  // Check if any authentication is required (for public routes with auth)
  if (requireAuth) {
    // Allow access if user is logged in (either admin or public user)
    if (user) {
      return children;
    }
    
    // Redirect to login if not authenticated
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      return <Navigate to={loginPath} state={{ from: location }} replace />;
    }
    return null;
  }

  // If no specific auth requirements, render children
  return children;
};

export default ProtectedRoute;
