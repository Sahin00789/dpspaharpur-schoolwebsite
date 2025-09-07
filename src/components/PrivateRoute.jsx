import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
