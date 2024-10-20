// src/api/auth.ts
import apiClient from './client';

export const login = async (email: string, password: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.post<ApiResponse<User>>('/auth/login', { email, password });
  return response.data;
};

export const loginDemo = async (username: string, password: string, projectId: string): Promise<ApiResponse<DemoUser>> => {
  const response = await apiClient.post<ApiResponse<DemoUser>>('/auth/login-demo', { username, password, projectId });
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
  return response.data;
};

export const refreshToken = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/auth/refresh-token');
  return response.data;
};
