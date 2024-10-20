// src/utils/errorHandler.ts
import axios, { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};