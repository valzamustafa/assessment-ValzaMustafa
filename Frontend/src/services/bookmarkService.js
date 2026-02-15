import api from './api';

export const bookmarkService = {
  async createBookmark(videoId, data) {
    const response = await api.post(`/bookmarks/${videoId}`, data);
    return response.data;
  },

  async getVideoBookmarks(videoId) {
    const response = await api.get(`/bookmarks/video/${videoId}`);
    return response.data;
  },

  async updateBookmark(id, data) {
    const response = await api.put(`/bookmarks/${id}`, data);
    return response.data;
  },

  async deleteBookmark(id) {
    const response = await api.delete(`/bookmarks/${id}`);
    return response.data;
  }
};