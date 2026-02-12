import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth.validations';
import { ApiResponse } from '@/types';
import { AuthResponse } from '@/types/auth';
import axios from '@/utils/api-client';
import { createUrlWithQuery, tryCatchWrapper } from '@/utils/api-utils';

export const authApi = {
  login: tryCatchWrapper(async (credentials: LoginFormValues) => {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }),

  register: tryCatchWrapper(async (data: RegisterFormValues) => {
    const response = await axios.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.REGISTER, data);

    return response.data;
  }),

  verifyEmail: tryCatchWrapper(async ({ email, otp }: { email: string; otp: string }) => {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, {
      email,
      otp,
    });
    return response.data;
  }),
  forgotPassword: tryCatchWrapper(async (data: { email: string }) => {
    const response = await axios.post<ApiResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  }),

  resetPassword: tryCatchWrapper(
    async (data: { password: string; confirmPassword: string; resetToken: string }) => {
      const response = await axios.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    }
  ),

  verifyResetOtp: tryCatchWrapper(async ({ email, otp }: { email: string; otp: string }) => {
    const response = await axios.post<ApiResponse<{ resetToken: string }>>(
      API_ENDPOINTS.AUTH.VERIFY_RESET_OTP,
      {
        email,
        otp,
      }
    );
    return response.data;
  }),

  getOAuthLoginUrl: tryCatchWrapper(
    async ({ provider, redirectUrl }: { provider: string; redirectUrl: string }) => {
      const response = await axios.get<ApiResponse<{ authUrl: string }>>(
        createUrlWithQuery(API_ENDPOINTS.AUTH.OAUTH_LOGIN_URL(provider), {
          redirectUrl,
        })
      );
      return response.data;
    }
  ),

  verifyGoogleToken: tryCatchWrapper(async (idToken: string) => {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_VERIFY, {
      idToken,
    });
    return response.data;
  }),

  logout: tryCatchWrapper(
    async ({ refreshToken, fcmToken }: { refreshToken: string; fcmToken?: string }) => {
      const response = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken,
        fcmToken,
      });
      return response.data;
    }
  ),
};
