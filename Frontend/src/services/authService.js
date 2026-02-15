import api from './api';

export const authService = {
async register(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    console.log('Register API response:', response.data);
    
    if (response.data.accessToken) {
      this.setTokens(response.data);
      this.setUser(response.data);
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error('Register error details:', error.response?.data || error);
    throw error;
  }
},

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.accessToken) {
        this.setTokens(response.data);
        this.setUser(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  },
async getAllUsers() {
  try {
    const response = await api.get('/users');
    console.log('getAllUsers response:', response.data);
    
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
},
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        this.setTokens(response.data);
        this.setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return false;
    }
  },

  setTokens(data) {
    localStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refresh_token', data.refreshToken);
    }
    const expiryTime = Date.now() + (data.expiresIn || 15 * 60 * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());
  },

  setUser(data) {
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    };
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isTokenExpired() {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }
};