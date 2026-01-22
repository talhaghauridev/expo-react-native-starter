import * as Constants from 'expo-constants';
import { Platform } from 'react-native';

export const isDevelopment = __DEV__;
export const getDevApiUrl = (devApiUrl: string): string => {
  if (!devApiUrl || devApiUrl.trim() === '') return devApiUrl;

  const url = devApiUrl.trim();

  if (url.startsWith('https://')) {
    return url;
  }

  if (isDevelopment) {
    try {
      if (Platform.OS === 'web') {
        return url;
      }

      const localhost = Constants.default.experienceUrl?.split(':')[1];
      if (!localhost) {
        console.warn('Falling back to production URL in development');
        return url;
      }

      return url.replace('//localhost', `${localhost}`);
    } catch (error) {
      console.warn('Error getting dev URL, falling back to production:', error);
      return url;
    }
  }

  return url;
};

export const buildQueryString = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

export const createUrlWithQuery = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;
  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const tryCatchWrapper = <T, Args extends any[]>(fn: (...args: Args) => Promise<T>) => {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (error.message === 'Network Error'
          ? 'Network connection failed. Please check your internet.'
          : error.message) ||
        'An unknown error occurred';

      throw new Error(errorMessage);
    }
  };
};
