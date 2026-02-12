import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse } from '@/types';
import { User } from '@/types/users';
import axios from '@/utils/api-client';
import { tryCatchWrapper } from '@/utils/api-utils';

export const usersApi = {
  getCurrentUser: tryCatchWrapper(async () => {
    const response = await axios.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.USERS.CURRENT_USER);
    return response.data;
  }),

  updateProfile: tryCatchWrapper(async (payload: { name: string }) => {
    const response = await axios.patch<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      payload
    );
    return response.data;
  }),

  uploadAvatar: tryCatchWrapper(async (formData: FormData) => {
    const response = await axios.post<ApiResponse<{ image: string }>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }),

  deleteAvatar: tryCatchWrapper(async () => {
    const response = await axios.delete<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE_IMAGE
    );
    return response.data;
  }),

  changePassword: tryCatchWrapper(
    async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await axios.post<ApiResponse>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, payload);
      return response.data;
    }
  ),
};
