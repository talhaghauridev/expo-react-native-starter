import { STORAGE_KEYS } from '@/constants/storage-keys';
import { StorageService } from '@/services/storage';
import { create } from 'zustand';

interface OnboardingState {
  isLoading: boolean;
  isInitialized: boolean;
  hasCompletedOnboarding: boolean;

  initializeOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialState = {
  isInitialized: false,
  hasCompletedOnboarding: false,
  isLoading: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  initializeOnboarding: () => {
    try {
      set({ isLoading: true, isInitialized: false });

      const completedStatus = StorageService.getItem(STORAGE_KEYS.ONBOARDING.COMPLETED);

      set({
        isLoading: false,
        isInitialized: true,
        hasCompletedOnboarding: completedStatus === 'true',
      });
    } catch (error) {
      console.error('Failed to initialize onboarding:', error);
      set({
        isLoading: false,
        isInitialized: true,
        hasCompletedOnboarding: false,
      });
    }
  },

  completeOnboarding: () => {
    try {
      StorageService.setItem(STORAGE_KEYS.ONBOARDING.COMPLETED, 'true');
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  },

  resetOnboarding: () => {
    try {
      StorageService.removeItem(STORAGE_KEYS.ONBOARDING.COMPLETED);
      set({ hasCompletedOnboarding: false });
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  },
}));
