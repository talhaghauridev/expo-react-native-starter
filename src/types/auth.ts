import { AvailableOAuthProviders } from '@/constants/constants';
import { ApiResponse } from '.';
import { User } from './users';

type AuthResponse = ApiResponse<{
  user: User;
  accessToken: string;
  refreshToken: string;
}>;

type UploadImageResponse = ApiResponse<{
  public_id: string;
  url: string;
}>;

type OAuthProvider = (typeof AvailableOAuthProviders)[number];

type OAuthPayload = {
  redirectUrl?: string;
};

export type { AuthResponse, UploadImageResponse, OAuthProvider, OAuthPayload };
