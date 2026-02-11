import { ApiResponse } from '.';
import { OAuthProvider } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  image: string | null;
  providerId: OAuthProvider;
  provider: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CurrentUserResponse extends ApiResponse {
  user: User;
}

export interface UpdateProfilePayload {
  id: string;
  name: string;
  email: string;
  password: string | null;
  image: string | null;
  providerId: string | null;
  provider: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileResponse extends ApiResponse {
  user: User;
}
