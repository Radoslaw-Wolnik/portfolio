// src/api/user.ts
import apiClient from './client';
import { PaginatedResponse, UserWithToken } from '../types/api'; // @types doesnt work :<

export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/profile');
  return response.data;
};

export const updateProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/profile', userData);
  return response.data;
};

export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: { page, limit } });
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

export const registerUser = async (userData: Omit<User, 'id' | 'role'>): Promise<ApiResponse<UserWithToken>> => {
  const response = await apiClient.post<ApiResponse<UserWithToken>>('/users/register', userData);
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.put<ApiResponse<{ message: string }>>('/users/change-password', { currentPassword, newPassword });
  return response.data;
};