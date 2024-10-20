import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

type UserType = User | DemoUser | null;

interface AuthContextType {
  user: UserType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (username: string, password: string, projectId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  signalProjectExit: (projectId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ user: User; message: string }>('/api/auth/login', { email, password });
    setUser(response.data.user);
  };

  const loginDemo = async (username: string, password: string, projectId: string) => {
    const response = await api.post<{ demoUser: DemoUser; message: string }>('/api/auth/login-demo', { username, password, projectId });
    setUser(response.data.demoUser);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get<User>('/api/users/profile');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      if (user && 'role' in user) {
        // Regular user
        await api.post<{ message: string }>('/api/auth/refresh-token');
      } else if (user) {
        // Demo user
        await api.post<{ message: string }>('/api/auth/refresh-demo-token');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
    }
  }, [user]);

  const signalProjectExit = async (projectId: string) => {
    await api.post(`/api/projects/${projectId}/signal-exit`);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginDemo, logout, refreshUser, refreshToken, signalProjectExit }}>
      {children}
    </AuthContext.Provider>
  );
};