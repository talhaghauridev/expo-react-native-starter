import { STORAGE_KEYS } from '@/constants/storage-keys';
import { StorageService } from '@/services/storage';
import { create } from 'zustand';

type User = any;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  setCredentials: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
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

  initializeAuth: async () => {
    set({ isLoading: true, isInitialized: false });
    try {
      const [user, token] = await Promise.all([
        StorageService.getObject<User>(STORAGE_KEYS.AUTH.USER_INFO),
        StorageService.getItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN),
      ]);

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

  setCredentials: async (user, token) => {
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      error: null,
    });

    await Promise.all([
      StorageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user),
      StorageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, token),
    ]);
  },

  setUser: async (user) => {
    set({ user, isAuthenticated: true, error: null });
    await StorageService.setObject(STORAGE_KEYS.AUTH.USER_INFO, user);
  },

  setToken: async (token) => {
    set({ accessToken: token, error: null });
    await StorageService.setItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN, token);
  },

  logout: async () => {
    try {
      set((state) => ({ ...state, isLoading: true }));

      await Promise.all([
        StorageService.removeItem(STORAGE_KEYS.AUTH.USER_INFO),
        StorageService.removeItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN),
      ]);

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
