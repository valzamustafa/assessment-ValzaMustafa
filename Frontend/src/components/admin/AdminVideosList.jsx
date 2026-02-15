import { Link } from 'react-router-dom';
import { VideoCameraIcon, ChatBubbleLeftIcon, BookmarkIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminVideosList = ({ videos }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">All Videos</h2>
      
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <VideoCameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No videos uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <Link to={`/video/${video.id}`} key={video.id}>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{video.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-1" />
                        User ID: {video.userId}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(video.uploadedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-3 md:mt-0">
                    <div className="flex items-center text-sm text-gray-600">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1 text-green-500" />
                      <span>{video.annotationCount || 0}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookmarkIcon className="h-4 w-4 mr-1 text-purple-500" />
                      <span>{video.bookmarkCount || 0}</span>
                    </div>
                    <span className="text-xs text-gray-400 ml-4">{video.fileSize ? (video.fileSize / 1024 / 1024).toFixed(1) + ' MB' : ''}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVideosList;