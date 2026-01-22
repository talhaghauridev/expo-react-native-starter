import { useAuthStore } from '@/stores/auth-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';

const perfTracker = {
  marks: {} as Record<string, number>,

  mark(name: string) {
    this.marks[name] = Date.now();
  },

  measure(startMark: string, endMark: string) {
    const start = this.marks[startMark];
    const end = this.marks[endMark];
    if (!start || !end) return 0;
    return end - start;
  },

  logReport() {
    const total = this.measure('app-start', 'splash-hidden');
    const authInit = this.measure('app-start', 'auth-initialized');

    console.log('📊 DETAILED PERFORMANCE REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏱️  Total Startup: ${total}ms (${(total / 1000).toFixed(2)}s)`);
    console.log(`🔐 Auth Init: ${authInit}ms`);
    console.log(`🎨 UI Render: ${total - authInit}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Performance rating
    if (total < 1000) console.log('✅ Excellent performance!');
    else if (total < 2000) console.log('⚡ Good performance');
    else if (total < 3000) console.log('⚠️  Acceptable performance');
    else console.log('🐌 Slow - needs optimization');
  },
};

perfTracker.mark('app-start');

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
    if (isInitialized) {
      perfTracker.mark('auth-initialized');
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isFullyLoaded) return;

    (async () => {
      try {
        await SplashScreen.hideAsync();
        perfTracker.mark('splash-hidden');
        perfTracker.logReport();
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
