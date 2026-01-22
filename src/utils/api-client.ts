import { API_BASE_URL } from '@/constants/api-endpoints';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { StorageService } from '@/services/storage';
import axiosClient from 'axios';
import { Platform } from 'react-native';
const axios = axiosClient.create({
  baseURL: API_BASE_URL,
});

axios.interceptors.request.use(
  async (config) => {
    try {
      config.headers['X-Client-Type'] = Platform.OS;
      const token = await StorageService.getItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
