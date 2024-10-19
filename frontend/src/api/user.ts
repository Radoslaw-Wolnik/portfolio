// api/user.ts
import apiClient from './client';
import { User, ApiResponse } from '@types/api';

export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/profile');
  return response.data;
};

export const updateProfile = async (username: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/profile', { username });
  return response.data;
};

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
  return response.data;
};
