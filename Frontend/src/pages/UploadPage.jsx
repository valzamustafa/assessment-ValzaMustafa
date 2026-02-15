import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { videoService } from '../services/videoService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('Title', title);           
    formData.append('VideoFile', videoFile);  
    

    try {
      const response = await videoService.uploadVideo(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      if (response?.success) {
        toast.success('Video uploaded successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload video';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-md p-6">
        <Input
          label="Video Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter video description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
            {!videoFile ? (
              <>
                <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop or click to select</p>
                <p className="text-sm text-gray-500">MP4, WebM, OGG (Max 100MB)</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600 font-medium">{videoFile.name}</p>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={loading}
          icon={VideoCameraIcon}
        >
          Upload Video
        </Button>
      </form>
    </div>
  );
};

export default UploadPage;