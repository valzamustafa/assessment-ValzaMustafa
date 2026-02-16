import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HomeIcon, 
  VideoCameraIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <VideoCameraIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              VideoAnnotate
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {(!isAuthenticated || (isAuthenticated && user?.role !== 'Admin')) && (
              <Link to="/" className="nav-link">
                <HomeIcon className="h-5 w-5" />
                <span className="hidden md:inline">Home</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user?.role === 'Admin' && (
                  <Link to="/admin" className="nav-link bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span className="hidden md:inline font-medium">Admin Panel</span>
                  </Link>
                )}

                <Link to="/upload" className="nav-link bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg">
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span className="hidden md:inline font-medium">Upload Video</span>
                </Link>

                {user?.role !== 'Admin' && (
                  <Link to="/dashboard" className="nav-link">
                    <VideoCameraIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                      {user?.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="text-sm hidden md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
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