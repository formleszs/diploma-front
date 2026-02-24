import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '@/types/auth';

export const API_ORIGIN = 'http://localhost:8080';

// В dev используем относительный /api — Vite proxy перенаправляет на backend. В prod — полный URL.
const baseURL = import.meta.env.DEV ? '/api' : `${API_ORIGIN}/api`;

export const http = axios.create({
  baseURL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    if (!config.headers) config.headers = {} as typeof config.headers;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

