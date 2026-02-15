import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoCameraIcon, BookmarkIcon, ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { videoService } from '../services/videoService';
import { useAuth } from '../hooks/useAuth';
import VideoGrid from '../components/video/VideoGrid';
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
        const userVideos = await videoService.getUserVideos();
        setVideos(userVideos);
        
        const totalAnnotations = userVideos.reduce((sum, video) => sum + (video._count?.annotations || 0), 0);
        const totalBookmarks = userVideos.reduce((sum, video) => sum + (video._count?.bookmarks || 0), 0);
        
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your videos</p>
        </div>
        <Link to="/upload">
          <Button variant="primary" size="lg" icon={VideoCameraIcon}>
            Upload New Video
          </Button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Videos</h2>
          {videos.length > 0 && (
            <Link to="/upload" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New
            </Link>
          )}
        </div>
        <VideoGrid videos={videos} loading={loading} />
        
        {videos.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-md"
          >
            <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-500 mb-6">Upload your first video to get started</p>
            <Link to="/upload">
              <Button variant="primary" icon={VideoCameraIcon}>
                Upload Video
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPage;