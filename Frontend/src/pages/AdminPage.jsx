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
        
        let allUsers = [];
        try {
          allUsers = await authService.getAllUsers();
          console.log('All users:', allUsers);
        } catch (error) {
          console.error('Error loading users:', error);
          allUsers = [{
            id: user?.id || 1,
            fullName: user?.name || 'Admin User',
            email: user?.email || 'admin@example.com',
            role: 'Admin',
            createdAt: new Date().toISOString(),
            videos: []
          }];
        }
        setUsers(allUsers);
        const totalAnnotations = allVideos.reduce((sum, video) => sum + (video.annotationCount || 0), 0);
        const totalBookmarks = allVideos.reduce((sum, video) => sum + (video.bookmarkCount || 0), 0);
        
        setStats({
          totalVideos: allVideos.length,
          totalAnnotations,
          totalBookmarks,
          totalUsers: allUsers.length
        });
        
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
               
              </button>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-primary-100 mt-2">Manage all content across the platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-primary-100">Welcome back,</p>
                <p className="font-semibold text-lg">{user?.name || 'Admin User'}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <AdminStats stats={stats} />

        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
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

          <div className="p-6">
            {activeTab === 'videos' && <AdminVideosList videos={videos} />}
            {activeTab === 'users' && <AdminUsersList users={users} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;