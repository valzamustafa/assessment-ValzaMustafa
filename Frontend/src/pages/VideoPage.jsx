import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import VideoPlayer from '../components/video/VideoPlayer';
import AnnotationList from '../components/video/AnnotationList';
import BookmarkList from '../components/video/BookmarkList';
import { videoService } from '../services/videoService';
import toast from 'react-hot-toast';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true);
        const videoData = await videoService.getVideo(id);
        setVideo(videoData);
        
        try {
          const annotationsData = await videoService.getVideoAnnotations(id);
          setAnnotations(annotationsData || []);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.log('No annotations yet');
          setAnnotations([]);
        }
        try {
          const bookmarksData = await videoService.getVideoBookmarks(id);
          setBookmarks(bookmarksData || []);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.log('No bookmarks yet');
          setBookmarks([]);
        }
        
      } catch (error) {
        console.error('Error loading video:', error);
        toast.error('Failed to load video');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadVideoData();
    }
  }, [id, navigate]);

  const handleAddBookmark = async (bookmark) => {
    try {
      const bookmarkData = {
        videoId: parseInt(id),
        timestamp: Math.floor(bookmark.timestamp),
        title: bookmark.title
      };
      
      const newBookmark = await videoService.addBookmark(id, bookmarkData);
      setBookmarks([...bookmarks, newBookmark]);
      toast.success('Bookmark added!');
    } catch (error) {
      console.error('Add bookmark error:', error);
      toast.error(error.response?.data?.message || 'Failed to add bookmark');
    }
  };

  const handleDeleteBookmark = async (index) => {
    try {
      const bookmarkId = bookmarks[index].id;
      await videoService.deleteBookmark(id, bookmarkId);
      setBookmarks(bookmarks.filter((_, i) => i !== index));
      toast.success('Bookmark deleted');
    } catch (error) {
      console.error('Delete bookmark error:', error);
      toast.error('Failed to delete bookmark');
    }
  };

  const handleAddAnnotation = async (annotation) => {
    try {
      const annotationData = {
        videoId: parseInt(id),
        timestamp: Math.floor(annotation.timestamp),
        description: annotation.description
      };
      
      const newAnnotation = await videoService.addAnnotation(id, annotationData);
      setAnnotations([...annotations, newAnnotation]);
      toast.success('Annotation added!');
    } catch (error) {
      console.error('Add annotation error:', error);
      toast.error(error.response?.data?.message || 'Failed to add annotation');
    }
  };

  const handleDeleteAnnotation = async (index) => {
    try {
      const annotationId = annotations[index].id;
      await videoService.deleteAnnotation(id, annotationId);
      setAnnotations(annotations.filter((_, i) => i !== index));
      toast.success('Annotation deleted');
    } catch (error) {
      console.error('Delete annotation error:', error);
      toast.error('Failed to delete annotation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{video?.title}</h1>
          <p className="text-gray-600">{video?.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            videoUrl={video?.videoUrl}
            annotations={annotations}
            bookmarks={bookmarks}
            onTimeUpdate={setCurrentTime}
          />
        </div>

        <div className="space-y-6">
          <AnnotationList
            annotations={annotations}
            onAdd={handleAddAnnotation}
            onDelete={handleDeleteAnnotation}
            currentTime={currentTime}
          />
          
          <BookmarkList
            bookmarks={bookmarks}
            onAdd={handleAddBookmark}
            onDelete={handleDeleteBookmark}
            onJump={(time) => {
              if (time) setCurrentTime(time);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;