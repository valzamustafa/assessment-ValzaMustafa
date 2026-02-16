import { UserIcon, CalendarIcon, VideoCameraIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AdminUsersList = ({ users }) => {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Users</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <UserIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
          <p className="text-gray-500">All registered users will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                  user.role === 'Admin' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  <UserIcon className="h-7 w-7" />
                </div>
               
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">{user.fullName}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <EnvelopeIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs">
                    <span className="flex items-center text-gray-500">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <VideoCameraIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {user.videoCount || user.videos?.length || 0} videos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;