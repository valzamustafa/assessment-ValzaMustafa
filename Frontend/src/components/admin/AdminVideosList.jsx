import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  VideoCameraIcon, 
  ChatBubbleLeftIcon, 
  BookmarkIcon, 
  CalendarIcon, 
  UserIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { videoService } from '../../services/videoService';
import toast from 'react-hot-toast';

const AdminVideosList = ({ videos, onVideoDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb.toFixed(1) + ' MB';
  };

  const handleDeleteVideo = async (e, videoId, videoTitle) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to delete video "${videoTitle}"?`)) {
      return;
    }
    
    setDeletingId(videoId);
    
    try {
      await videoService.deleteVideo(videoId);
      
      toast.success('Video deleted successfully!');
      
      if (onVideoDeleted) {
        onVideoDeleted(videoId);
      }
      
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error(error.response?.data?.message || 'Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">All Videos</h2>
        <Link to="/upload">
          <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            <VideoCameraIcon className="h-4 w-4" />
            <span>Upload New</span>
          </button>
        </Link>
      </div>
      
      {videos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <VideoCameraIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos uploaded yet</h3>
          <p className="text-gray-500 mb-6">Videos from all users will appear here</p>
          <Link to="/upload">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl transition-colors">
              Upload First Video
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="relative group">
              <Link to={`/video/${video.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{video.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {video.description || 'No description provided'}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                            <span className="flex items-center text-gray-500">
                              <UserIcon className="h-3 w-3 mr-1" />
                              User #{video.userId}
                            </span>
                            <span className="flex items-center text-gray-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDate(video.uploadedAt)}
                            </span>
                            {video.fileSize && (
                              <span className="text-gray-400">
                                {formatFileSize(video.fileSize)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-4 md:mt-0 ml-20 md:ml-0">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-lg">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1.5 text-green-500" />
                          <span className="font-medium">{video.annotationCount || 0}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                          <BookmarkIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                          <span className="font-medium">{video.bookmarkCount || 0}</span>
                        </div>
                      </div>
                      
                      <div className="text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <button
                onClick={(e) => handleDeleteVideo(e, video.id, video.title)}
                disabled={deletingId === video.id}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete video"
              >
                {deletingId === video.id ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <TrashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVideosList;