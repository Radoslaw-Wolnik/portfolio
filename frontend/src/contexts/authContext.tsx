// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '@utils/api';

interface AuthContextType {
  user: User | DemoUser | null;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    try {
      // Assuming there's an endpoint for refreshing the token
      await api.post('/auth/refresh-token');
      // After refreshing, fetch the updated user profile
      const response = await api.get<ApiResponse<User>>('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<ApiResponse<User>>('/users/profile');
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to get user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};