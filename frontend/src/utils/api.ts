// src/utils/api.ts
import axios from 'axios';
import { useEnvironment } from '../hooks/useEnvironment';

const env = useEnvironment();

const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await api.post('/auth/refresh-token');
        return api(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
