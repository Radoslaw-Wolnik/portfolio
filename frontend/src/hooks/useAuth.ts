// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import api from '@utils/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<ApiResponse<User>>('/auth/login', { email, password });
    context.user = response.data.data;
  };

  const loginDemo = async (username: string, password: string, projectId: string): Promise<void> => {
    const response = await api.post<ApiResponse<DemoUser>>('/auth/login-demo', { username, password, projectId });
    context.user = response.data.data;
  };

  const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
    context.user = null;
  };

  const refreshUser = async (): Promise<void> => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    context.user = response.data.data;
  };

  return { ...context, login, loginDemo, logout, refreshUser };
};
