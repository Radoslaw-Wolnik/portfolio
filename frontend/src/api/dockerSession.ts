// src/api/dockerSession.ts
import apiClient from './client';

export const createSession = async (projectName: string, username: string): Promise<ApiResponse<DockerSession>> => {
  const response = await apiClient.post<ApiResponse<DockerSession>>('/docker-sessions', { projectName, username });
  return response.data;
};

export const getSession = async (sessionId: string): Promise<ApiResponse<DockerSession>> => {
  const response = await apiClient.get<ApiResponse<DockerSession>>(`/docker-sessions/${sessionId}`);
  return response.data;
};

export const listUserSessions = async (): Promise<ApiResponse<DockerSession[]>> => {
  const response = await apiClient.get<ApiResponse<DockerSession[]>>('/docker-sessions');
  return response.data;
};

export const terminateSession = async (sessionId: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/docker-sessions/${sessionId}`);
  return response.data;
};

export const swapUser = async (sessionId: string, newUsername: string): Promise<ApiResponse<DockerSession>> => {
  const response = await apiClient.put<ApiResponse<DockerSession>>(`/docker-sessions/${sessionId}/swap-user`, { newUsername });
  return response.data;
};
