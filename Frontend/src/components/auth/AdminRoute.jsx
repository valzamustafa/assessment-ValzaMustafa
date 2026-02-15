import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  console.log('AdminRoute - user:', user);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - user role:', user?.role);

  if (!isAuthenticated) {
    console.log('AdminRoute - not authenticated, redirect to login');
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Admin') {
    console.log('AdminRoute - not admin, redirect to dashboard');
    return <Navigate to="/dashboard" />;
  }

  console.log('AdminRoute - is admin, showing admin page');
  return children;
};

export default AdminRoute;