import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, roles = [], redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has any of the required roles
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to unauthorized or home based on user role
    const redirectPath = user.role === 'admin' ? '/admin/unauthorized' : '/unauthorized';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%'
  }
};

export default ProtectedRoute;
