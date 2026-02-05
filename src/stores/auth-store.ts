import { STORAGE_KEYS } from '@/constants/storage-keys';
import { storageService } from '@/services/storage';
import { create } from 'zustand';

type User = any;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initializeAuth: () => void;
  setCredentials: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
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
      set({
        isLoading: false,
        isInitialized: true,
        error: 'Failed to load user data',
      });
    }
  },

  setCredentials: (user, token) => {
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      error: null,
    });

    storageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user);
    storageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, token);
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true, error: null });
    storageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user);
  },

  setToken: (token) => {
    set({ accessToken: token, error: null });
    storageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, token);
  },

  logout: () => {
    try {
      set((state) => ({ ...state, isLoading: true }));

      storageService.removeItem(STORAGE_KEYS.AUTH.USER_INFO);
      storageService.removeItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to logout' });
    }
  },
}));
