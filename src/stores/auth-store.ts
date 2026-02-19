import { STORAGE_KEYS } from '@/constants/storage-keys';
import { storageService } from '@/services/storage';
import { User } from '@/types/users';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initializeAuth: () => void;
  setCredentials: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setToken: ({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) => void;

  logout: () => void;
}

const initialValues = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialValues,

  initializeAuth: () => {
    set({ isLoading: true, isInitialized: false });
    try {
      const user = storageService.getObject(STORAGE_KEYS.AUTH.USER_INFO);
      const token = storageService.getItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);

      if (user && token) {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          isInitialized: true,
          error: 'No user data found',
        });
      }
    } catch (error) {
      console.error('❌ AUTH INITIALIZATION ERROR:', error);
      set({
        isLoading: false,
        isInitialized: true,
        error: 'Failed to load user data',
      });
    }
  },

  setCredentials: (user, accessToken, refreshToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      error: null,
    });
    storageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user);
    storageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, accessToken);
    storageService.setItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refreshToken);
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true, error: null });
    storageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user);
  },
  setToken: ({ access_token, refresh_token }) => {
    set({ accessToken: access_token, error: null });
    storageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, access_token);
    storageService.setItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN, refresh_token);
  },

  logout: () => {
    try {
      set((state) => ({ ...state, isLoading: true }));

      storageService.removeItem(STORAGE_KEYS.AUTH.USER_INFO);
      storageService.removeItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
      storageService.removeItem(STORAGE_KEYS.AUTH.REFRESH_TOKEN);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      console.error('❌ LOGOUT ERROR:', error);
      set({ error: 'Failed to logout', isLoading: false });
    }
  },
}));
