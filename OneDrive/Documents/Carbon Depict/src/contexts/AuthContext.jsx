// Cache bust 2025-10-23
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

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
      console.log('🔐 AuthContext.login called')
      console.log('  Email:', email)
      console.log('  Password length:', password.length)
      
      setError(null);
      
      console.log('📡 Calling apiClient.auth.login...')
      
      // Retry logic with exponential backoff
      let response;
      const maxRetries = 3;
      const retryDelays = [2000, 5000, 30000]; // 2s, 5s, 30s
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          response = await apiClient.auth.login({ email, password });
          break; // Success, exit retry loop
        } catch (err) {
          // If it's a 429 rate limit error and we have retries left
          if (err.response?.status === 429 && attempt < maxRetries - 1) {
            const delay = retryDelays[attempt] || 30000;
            console.log(`⏳ Rate limited (attempt ${attempt + 1}/${maxRetries}). Waiting ${delay/1000}s before retry...`)
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // If we exhausted retries with 429, show user-friendly message
          if (err.response?.status === 429 && attempt === maxRetries - 1) {
            throw new Error('Rate limit exceeded. Please wait 30 seconds and try again.');
          }
          
          // For other errors, throw immediately
          throw err;
        }
      }
      
      // If no response after retries, throw error
      if (!response) {
        throw new Error('Login failed after multiple attempts');
      }
      
      console.log('📨 Response received:', {
        status: response.status,
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      })
      
      const { token, user: userData } = response.data;

      // Store token
      console.log('💾 Storing token in localStorage...')
      localStorage.setItem('authToken', token);
      
      // Set user data
      console.log('👤 Setting user data...')
      setUser(userData);

      console.log('✅ Login successful!')
      return { success: true, user: userData };
    } catch (err) {
      console.error('❌ Login error caught:')
      console.error('  Error object:', err)
      console.error('  Response data:', err.response?.data)
      console.error('  Status:', err.response?.status)
      
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle custom Error objects (for rate limit)
      if (err instanceof Error && !err.response) {
        errorMessage = err.message;
      } 
      // Handle API rate limit errors
      else if (err.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      } 
      // Handle other API errors
      else {
        errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed. Please try again.';
      }
      
      console.error('  Final error message:', errorMessage)
      
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

