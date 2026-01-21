export const API_BASE_URL = '';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    FACEBOOK: '/auth/facebook',
    VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
    RESEND_OTP: '/auth/resend-email-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    UPLOAD_IMAGE: '/auth/upload-image',
  },

  USERS: {
    BASE: '/users',
    CURRENT_USER: '/users/profile',
    UPDATE_PROFILE: '/users/me',
  },
};
