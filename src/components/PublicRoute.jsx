// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  public: isPublic = false, 
  requireAuth = false 
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

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

  if (isPublic) {
    return children;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    toast.error('Admin access required');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;