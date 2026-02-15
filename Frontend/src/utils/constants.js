export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const VIDEO_MAX_SIZE = 100 * 1024 * 1024;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export const ANIMATIONS = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }
};