import { env } from '@/env';
import { getDevApiUrl } from '@/utils/api-utils';

export const API_BASE_URL = getDevApiUrl(env.EXPO_PUBLIC_API_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
    RESEND_OTP: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password-otp',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    REFRESH_TOKEN: '/auth/refresh-token',
    GOOGLE_VERIFY: '/auth/google/token',
    LOGOUT: '/auth/logout',
    OAUTH_LOGIN_URL: (provider: string) => `/auth/${provider}/url`,
  },

  USERS: {
    BASE: '/users',
    CURRENT_USER: '/users/me',
    UPDATE_PROFILE: '/users/profile',
    UPDATE_PROFILE_IMAGE: '/users/avatar',
    CHANGE_PASSWORD: '/users/change-password',
  },
};
