import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VideoCameraIcon, BookmarkIcon, ChatBubbleLeftIcon, PlusIcon,PlayIcon   } from '@heroicons/react/24/outline';
import { videoService } from '../services/videoService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalAnnotations: 0,
    totalBookmarks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await videoService.getUserVideos();
        console.log('Dashboard videos:', response); 
        
        const userVideos = response || [];
        setVideos(userVideos);
        const totalAnnotations = userVideos.reduce((sum, video) => {
          return sum + (video.annotationCount || 0);
        }, 0);
        
        const totalBookmarks = userVideos.reduce((sum, video) => {
          return sum + (video.bookmarkCount || 0);
        }, 0);
        
        setStats({
          totalVideos: userVideos.length,
          totalAnnotations,
          totalBookmarks
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, icon: VideoCameraIcon, color: 'bg-blue-500' },
    { label: 'Annotations', value: stats.totalAnnotations, icon: ChatBubbleLeftIcon, color: 'bg-green-500' },
    { label: 'Bookmarks', value: stats.totalBookmarks, icon: BookmarkIcon, color: 'bg-purple-500' },
  ];

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your videos</p>
        </div>
        <Link to="/upload">
          <Button variant="primary" size="lg" icon={VideoCameraIcon}>
            Upload New Video
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>


      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Videos</h2>
          {videos.length > 0 && (
            <Link to="/upload" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add New
            </Link>
          )}
        </div>
        
        {videos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <VideoCameraIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-500 mb-6">Upload your first video to get started</p>
            <Link to="/upload">
              <Button variant="primary" size="lg" icon={VideoCameraIcon}>
                Upload Video
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link to={`/video/${video.id}`} key={video.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoCameraIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {video.description || 'No description'}
                    </p>
                 
                    <div className="flex items-center space-x-4 text-sm border-t pt-4 border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1.5 text-green-500" />
                        <span>{video.annotationCount || 0} annotations</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookmarkIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                        <span>{video.bookmarkCount || 0} bookmarks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;