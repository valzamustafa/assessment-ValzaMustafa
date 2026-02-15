import api from './api';

export const annotationService = {
  async createAnnotation(videoId, data) {
    const response = await api.post(`/annotations/${videoId}`, data);
    return response.data;
  },

  async getVideoAnnotations(videoId) {
    const response = await api.get(`/annotations/video/${videoId}`);
    return response.data;
  },

  async updateAnnotation(id, data) {
    const response = await api.put(`/annotations/${id}`, data);
    return response.data;
  },

  async deleteAnnotation(id) {
    const response = await api.delete(`/annotations/${id}`);
    return response.data;
  }
};