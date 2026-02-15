import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { videoService } from '../services/videoService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import AdminStats from '../components/admin/AdminStats';
import AdminVideosList from '../components/admin/AdminVideosList';
import AdminUsersList from '../components/admin/AdminUsersList';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalAnnotations: 0,
    totalBookmarks: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        console.log('Loading admin data...');
        
        const allVideos = await videoService.getAllVideos();
        console.log('All videos:', allVideos);
        setVideos(allVideos);
        
        try {
          const allUsers = await authService.getAllUsers();
          console.log('All users:', allUsers);
          setUsers(allUsers);
        } catch (error) {
          console.error('Error loading users:', error);
        }
        
        const totalAnnotations = allVideos.reduce((sum, video) => sum + (video.annotationCount || 0), 0);
        const totalBookmarks = allVideos.reduce((sum, video) => sum + (video.bookmarkCount || 0), 0);
        
        setStats({
          totalVideos: allVideos.length,
          totalAnnotations,
          totalBookmarks,
          totalUsers: users.length
        });
        
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all content</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome,</p>
            <p className="font-medium text-gray-900">{user?.name || 'Admin User'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <AdminStats stats={stats} />

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('videos')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Videos ({videos.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users ({users.length})
          </button>
        </nav>
      </div>

      {activeTab === 'videos' && <AdminVideosList videos={videos} />}
      {activeTab === 'users' && <AdminUsersList users={users} />}
    </div>
  );
};

export default AdminPage;