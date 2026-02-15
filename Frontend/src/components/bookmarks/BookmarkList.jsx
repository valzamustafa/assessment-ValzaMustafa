import { BookmarkIcon } from '@heroicons/react/24/outline';
import { formatTime } from '../../utils/formatTime';

const BookmarkList = ({ bookmarks, onBookmarkClick }) => {
  return (
    <div className="space-y-3">
      {bookmarks.map((bm) => (
        <div
          key={bm.id}
          onClick={() => onBookmarkClick(bm.time)}
          className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-200"
        >
          <div className="flex items-start space-x-3">
            <BookmarkIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-600">
                  {formatTime(bm.time)}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-900">{bm.title}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkList;