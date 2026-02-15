import api from './api';

export const videoService = {
  async uploadVideo(formData) {
    const response = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getAllVideos() {
    const response = await api.get('/videos');
    return response.data;
  },

  async getUserVideos() {
    const response = await api.get('/videos/my-videos');
    return response.data;
  },

  async getVideo(id) {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  async updateVideo(id, data) {
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  async deleteVideo(id) {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  }
};