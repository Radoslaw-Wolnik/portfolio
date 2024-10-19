// api/blog.ts
import apiClient from './client';
import { BlogPost, ApiResponse } from '@types/api';

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'author' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<BlogPost>> => {
  const response = await apiClient.post<ApiResponse<BlogPost>>('/blog', postData);
  return response.data;
};

export const getBlogPosts = async (page: number = 1, limit: number = 10, tag?: string): Promise<ApiResponse<{ blogPosts: BlogPost[], currentPage: number, totalPages: number, totalPosts: number }>> => {
  const response = await apiClient.get<ApiResponse<{ blogPosts: BlogPost[], currentPage: number, totalPages: number, totalPosts: number }>>('/blog', { params: { page, limit, tag } });
  return response.data;
};

export const getBlogPostById = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${id}`);
  return response.data;
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> => {
  const response = await apiClient.put<ApiResponse<BlogPost>>(`/blog/${id}`, postData);
  return response.data;
};

export const deleteBlogPost = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/blog/${id}`);
  return response.data;
};

export const searchBlogPosts = async (query: string): Promise<ApiResponse<BlogPost[]>> => {
  const response = await apiClient.get<ApiResponse<BlogPost[]>>('/blog/search', { params: { query } });
  return response.data;
};
