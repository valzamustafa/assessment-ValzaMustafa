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
        console.log('No refresh token available');
        return false;
      }

      console.log('Attempting to refresh token...');
      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        console.log('Token refreshed successfully');
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
    const expiresInSeconds = data.expiresIn || 900; 
    const expiryTime = Date.now() + (expiresInSeconds * 1000);
    
    localStorage.setItem('token_expiry', expiryTime.toString());
    
    console.log('Tokens saved:', {
      expiresInSeconds,
      expiryTime: new Date(expiryTime).toLocaleTimeString(),
      now: new Date().toLocaleTimeString()
    });
  },

  setUser(data) {
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User saved:', user);
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  getUser() {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  isTokenExpired() {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) {
      console.log('No expiry found, token considered expired');
      return true;
    }
    
    const expiryTime = parseInt(expiry);
    const now = Date.now();
    const isExpired = now > expiryTime;
    
    console.log('Token expiry check:', {
      expiryTime: new Date(expiryTime).toLocaleTimeString(),
      now: new Date(now).toLocaleTimeString(),
      timeLeft: Math.round((expiryTime - now) / 1000) + ' seconds',
      isExpired
    });
    
    return isExpired;
  },

  logout() {
    console.log('Logging out - clearing localStorage');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    const tokenValid = !!token && !this.isTokenExpired();
    const userValid = !!user;
    
    console.log('isAuthenticated check:', { 
      hasToken: !!token, 
      hasUser: !!user,
      tokenValid,
      userValid,
      isAuthenticated: tokenValid && userValid 
    });
    if (tokenValid && !userValid) {
      console.log('Token exists but user missing - clearing token');
      this.logout();
      return false;
    }
    
    return tokenValid && userValid;
  }
};