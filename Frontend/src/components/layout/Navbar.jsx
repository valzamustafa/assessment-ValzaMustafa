import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HomeIcon, 
  VideoCameraIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <VideoCameraIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              VideoAnnotation
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  <VideoCameraIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors ml-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;