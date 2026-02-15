import api from './api';

export const videoService = {
  async uploadVideo(formData, onProgress) {
    const response = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },

async getAllVideos() {
  try {
    const response = await api.get('/videos');
    console.log('getAllVideos full response:', response);
    console.log('getAllVideos data:', response.data);
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    return [];
  }
},
  async getUserVideos() {
    const response = await api.get('/videos/my-videos');
    return response.data?.data || [];
  },

  async getVideo(id) {
    const response = await api.get(`/videos/${id}`);
    return response.data?.data;
  },

  async deleteVideo(id) {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  async getVideoAnnotations(videoId) {
    try {
      const response = await api.get(`/videos/${videoId}/annotations`);
      return response.data?.data || [];
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return [];
    }
  },

  async addAnnotation(videoId, annotation) {
    const response = await api.post(`/videos/${videoId}/annotations`, annotation);
    return response.data?.data;
  },

  async deleteAnnotation(videoId, annotationId) {
    await api.delete(`/videos/${videoId}/annotations/${annotationId}`);
  },

  async getVideoBookmarks(videoId) {
    try {
      const response = await api.get(`/videos/${videoId}/bookmarks`);
      return response.data?.data || [];
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return [];
    }
  },

  async addBookmark(videoId, bookmark) {
    const response = await api.post(`/videos/${videoId}/bookmarks`, bookmark);
    return response.data?.data;
  },

  async deleteBookmark(videoId, bookmarkId) {
    await api.delete(`/videos/${videoId}/bookmarks/${bookmarkId}`);
  }
};