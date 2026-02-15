import { UserIcon, CalendarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const AdminUsersList = ({ users }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">All Users</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3 md:mt-0">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {formatDate(user.createdAt)}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <VideoCameraIcon className="h-3 w-3 mr-1" />
                    {user.videos?.length || 0} videos
                  </span>
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