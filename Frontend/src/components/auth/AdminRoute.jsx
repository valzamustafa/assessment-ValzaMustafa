import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('AdminRoute - loading:', loading);
  console.log('AdminRoute - user:', user);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - user role:', user?.role);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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