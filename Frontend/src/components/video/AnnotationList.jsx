import { useState } from 'react';
import { ChatBubbleLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const AnnotationList = ({ annotations = [], onAdd, onDelete, currentTime }) => {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
  if (newAnnotation.trim()) {
    onAdd({
      timestamp: Math.floor(currentTime),
      description: newAnnotation
    });
    setNewAnnotation('');
    setIsAdding(false);
  }
};

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-primary-600" />
          Annotations
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <textarea
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Write your annotation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
            rows="3"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
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

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {annotations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No annotations yet. Add one while watching!
          </p>
        ) : (
          annotations.map((annotation, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                Math.abs(annotation.timestamp - currentTime) < 1
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              } transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {Math.floor(annotation.timestamp / 60)}:
                    {(annotation.timestamp % 60).toString().padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-gray-700">{annotation.description}</p>
                </div>
                <button
                  onClick={() => onDelete(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnotationList;