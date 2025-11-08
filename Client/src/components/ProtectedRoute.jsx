import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated()) {
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  // Check if user is verified
  if (user && !user.isVerified && !location.pathname.includes('verify-otp')) {
    return <Navigate to="/verify-otp" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
