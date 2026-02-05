import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from '@/utils/api-client';
import { tryCatchWrapper } from '@/utils/api-utils';

export const authApi = {
  login: tryCatchWrapper(async (credentials) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }),

  register: tryCatchWrapper(async (data) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
      userFirstName: data.firstName,
      userLastName: data.lastName || '',
      userEmail: data.email,
      userPassword: data.password,
    });

    return response.data;
  }),

  uploadImage: tryCatchWrapper(async (file: any) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await axios.post(API_ENDPOINTS.AUTH.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }),

  forgotPassword: tryCatchWrapper(async (data: { email: string }) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  }),

  resetPassword: tryCatchWrapper(
    async (data: { password: string; confirmPassword: string; email: string }) => {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    }
  ),
};
