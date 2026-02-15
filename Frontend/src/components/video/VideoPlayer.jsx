import { useRef, useState, useMemo } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon 
} from '@heroicons/react/24/outline';

const VideoPlayer = ({ videoUrl, annotations = [], bookmarks = [], onTimeUpdate }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const showAnnotations = useMemo(() => {
    return annotations.filter(
      a => Math.abs(a.timestamp - currentTime) < 0.5
    );
  }, [currentTime, annotations]);

  const togglePlay = async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        await videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const time = e.target.value;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    if (videoRef.current) {
      const vol = e.target.value;
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const jumpToBookmark = async (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Playback error:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        />

        {showAnnotations.map((annotation, index) => (
          <div
            key={index}
            className="absolute bottom-20 left-4 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg animate-bounce"
          >
            {annotation.description}
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-8 w-8" />
                  ) : (
                    <PlayIcon className="h-8 w-8" />
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="h-6 w-6" />
                    ) : (
                      <SpeakerWaveIcon className="h-6 w-6" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {bookmarks.length > 0 && (
                <div className="flex space-x-2">
                  {bookmarks.map((bookmark, index) => (
                    <button
                      key={index}
                      onClick={() => jumpToBookmark(bookmark.timestamp)}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {bookmark.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;