import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.API_DOMAIN,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      config.headers['X-Auth'] = localStorage.getItem('auth-token');
    }
    return config;
  }
);