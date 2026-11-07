import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api', // Благодаря прокси Vite, запросы пойдут на бэкенд
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
