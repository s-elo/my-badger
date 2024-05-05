import axios from 'axios';
import { useUserStore } from '../store';

export const gbReq = axios.create({
  baseURL: 'https://api.github.com',
});

gbReq.interceptors.request.use((config) => {
  const userStore = useUserStore();

  config.headers['Authorization'] = `Bearer ${userStore.token}`;
  return config;
});

gbReq.interceptors.response.use((config) => {
  return config.data;
});
