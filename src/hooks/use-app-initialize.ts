import { useAuthStore } from '@/stores/auth-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';

export function useAppInitialize() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  console.log({
    isLoading,
    isInitialized,
  });

  const isFullyLoaded = useMemo(() => {
    return !isLoading && isInitialized;
  }, [isLoading, isInitialized]);

  useEffect(() => {
    if (!isFullyLoaded) return;

    (async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Splash hide failed', e);
      }
    })();
  }, [isFullyLoaded]);

  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    isFullyLoaded,
    isAuthenticated,
  };
}
