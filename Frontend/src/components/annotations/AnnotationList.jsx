import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { formatTime } from '../../utils/formatTime';

const AnnotationList = ({ annotations, currentTime, onAnnotationClick }) => {
  return (
    <div className="space-y-3">
      {annotations.map((ann) => (
        <div
          key={ann.id}
          onClick={() => onAnnotationClick(ann.time)}
          className={`
            p-3 rounded-lg cursor-pointer transition-all
            ${Math.abs(currentTime - ann.time) < 5 
              ? 'bg-primary-50 border border-primary-200' 
              : 'hover:bg-gray-50 border border-transparent'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <ChatBubbleLeftIcon className="h-5 w-5 text-primary-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-primary-600">
                  {formatTime(ann.time)}
                </span>
                <span className="text-xs text-gray-400">@{ann.user}</span>
              </div>
              <p className="text-sm text-gray-700">{ann.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnotationList;