// src/api/project.ts
import apiClient from './client';
import { PaginatedResponse } from '../types/api'; // @types doesnt work :<

export const createProject = async (projectData: Omit<Project, 'id' | 'status'>): Promise<ApiResponse<Project>> => {
  const response = await apiClient.post<ApiResponse<Project>>('/projects', projectData);
  return response.data;
};

export const getProjectById = async (id: string): Promise<ApiResponse<Project>> => {
  const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> => {
  const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/projects/${id}`);
  return response.data;
};

export const getAllProjects = async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>('/projects', { params: { page, limit } });
  return response.data;
};

export const deployProject = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(`/projects/${id}/deploy`);
  return response.data;
};

export const stopProject = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(`/projects/${id}/stop`);
  return response.data;
};

export const freezeProject = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(`/projects/${id}/freeze`);
  return response.data;
};

export const unfreezeProject = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(`/projects/${id}/unfreeze`);
  return response.data;
};