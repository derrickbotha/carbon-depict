// Cache bust 2025-10-23
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import esgDataManager from '../utils/esgDataManager';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token and get user data
          const response = await apiClient.auth.verifyToken();
          setUser(response.data.user);
          // Initialize ESG Data Manager after authentication
          await esgDataManager.initialize();
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);

      const loginData = { email, password };
      const response = await apiClient.auth.login(loginData);

      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem('authToken', token);

      // Set user data
      setUser(userData);

      // Initialize ESG Data Manager after successful login
      await esgDataManager.initialize();

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (registrationData) => {
    try {
      setError(null);
      const response = await apiClient.auth.register(registrationData);
      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem('authToken', token);

      // Set user data
      setUser(userData);

      // Initialize ESG Data Manager after successful registration
      await esgDataManager.initialize();

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('authToken');
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

