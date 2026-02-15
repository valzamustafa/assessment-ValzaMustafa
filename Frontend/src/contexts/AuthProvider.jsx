import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          console.log('AuthProvider - loaded user:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    console.log('AuthProvider - login data:', data);
    
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role 
    };
    
    console.log('AuthProvider - setting user:', userData);
    setUser(userData);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshToken = async () => {
    return await authService.refreshToken();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin' 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};