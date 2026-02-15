import { useState } from 'react';
import { BookmarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const BookmarkList = ({ bookmarks = [], onAdd, onDelete, onJump }) => {
  const [newBookmark, setNewBookmark] = useState({ title: '', timestamp: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newBookmark.title && newBookmark.timestamp) {
      const timestampInt = Math.floor(parseFloat(newBookmark.timestamp));
      
      onAdd({
        timestamp: timestampInt,
        title: newBookmark.title
      });
      setNewBookmark({ title: '', timestamp: '' });
      setIsAdding(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BookmarkIcon className="h-5 w-5 mr-2 text-purple-600" />
          Bookmarks
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newBookmark.title}
            onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
            placeholder="Bookmark title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <input
            type="number"
            step="1" 
            value={newBookmark.timestamp}
            onChange={(e) => setNewBookmark({ ...newBookmark, timestamp: e.target.value })}
            placeholder="Timestamp (seconds)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No bookmarks yet. Save important moments!
          </p>
        ) : (
          bookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <button
                onClick={() => onJump(bookmark.timestamp)}
                className="flex-1 text-left"
              >
                <p className="font-medium text-gray-900">{bookmark.title}</p>
                <p className="text-sm text-purple-600">
                  {formatTime(bookmark.timestamp)}
                </p>
              </button>
              <button
                onClick={() => onDelete(index)}
                className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarkList;