import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.API_DOMAIN,
  headers: {
    Accept: 'application/json',
  },
});
