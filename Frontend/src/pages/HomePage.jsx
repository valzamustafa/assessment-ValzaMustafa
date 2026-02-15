import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  VideoCameraIcon, 
  UserIcon, 
  CalendarIcon,
  PlayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { videoService } from '../services/videoService';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const userVideos = await videoService.getUserVideos();
        setVideos(userVideos);
      } catch (error) {
        console.error('Error loading videos:', error);
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">VideoAnnotate</h1>
        <p className="text-lg text-gray-600 mt-1">Welcome back, {user?.name || 'John Doe'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center">
             
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'John Doe'}</h2>
              <p className="text-gray-500 text-sm mt-1">{user?.email || 'user@example.com'}</p>
              
              <div className="w-full mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Videos</span>
                  <span className="font-semibold text-gray-900">{videos.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-semibold text-gray-900">Feb 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">All Videos</h2>
                <p className="text-gray-500 text-sm mt-1">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
              </div>
              
        
              <Link to="/upload">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                  <VideoCameraIcon className="h-5 w-5" />
                  <span>Upload</span>
                </button>
              </Link>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-12">
                <VideoCameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No videos yet</h3>
                <p className="text-gray-500 mb-6">Upload your first video to get started</p>
                <Link to="/upload">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
                    Upload Video
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video) => (
                  <Link to={`/video/${video.id}`} key={video.id}>
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                 
                      <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <PlayIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{video.description || 'No description'}</p>
                       
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {new Date(video.createdAt || '2026-02-15').toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span>{video._count?.annotations || 0} annotations</span>
                          <span>{video._count?.bookmarks || 0} bookmarks</span>
                        </div>
                      </div>
                      
    
                      <div className="text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;