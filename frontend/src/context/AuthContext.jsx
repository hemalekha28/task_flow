import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from localStorage only once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load user info when token changes
  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error, defaultMessage) => {
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors[0].msg;
    }
    return error.response?.data?.message || defaultMessage;
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Login failed')
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Registration failed')
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    try {
      const response = await api.put('/auth/updatedetails', { name, email });
      const updatedUser = response.data.data;
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Profile update failed')
      };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/updatepassword', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Password update failed')
      };
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  }), [user, token, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};