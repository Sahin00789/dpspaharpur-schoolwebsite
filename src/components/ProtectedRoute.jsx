import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please sign in to access this page');
    } else if (!loading && requiredAdmin && !isAdmin) {
      toast.error('Admin privileges required');
    }
  }, [isAuthenticated, isAdmin, loading]);

  // Show loading spinner while checking auth state
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if admin access is required but user is not admin
  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
