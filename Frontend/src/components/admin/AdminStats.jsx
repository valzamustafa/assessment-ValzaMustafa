import { VideoCameraIcon, BookmarkIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminStats = ({ stats }) => {
  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, icon: VideoCameraIcon, color: 'bg-blue-500' },
    { label: 'Total Annotations', value: stats.totalAnnotations, icon: ChatBubbleLeftIcon, color: 'bg-green-500' },
    { label: 'Total Bookmarks', value: stats.totalBookmarks, icon: BookmarkIcon, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: UserIcon, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
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
  );
};

export default AdminStats;