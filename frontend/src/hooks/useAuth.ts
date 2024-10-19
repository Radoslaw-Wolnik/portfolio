// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';
import { User } from '@types/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await authApi.refreshToken();
      // You might want to update the user here if the backend returns updated user info
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to get user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, login, logout, refreshToken, loading };
};
