import { JsStack } from '@/components/animated-stack';
import { NAV_THEME } from '@/constants/theme';
import '@/global.css';
import { useAppInitialize } from '@/hooks/use-app-initialize';
import AppProvider from '@/lib/app-providers';
import { ErrorBoundary } from '@/lib/error-boundary';
import { useAuthStore } from '@/stores/auth-store';
import { ThemeProvider } from '@react-navigation/native';
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

function InitialLayout() {
  const { isFullyLoaded } = useAppInitialize();
  const { isAuthenticated } = useAuthStore();

  if (!isFullyLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME.light}>
      <View className="h-full w-full bg-background">
        <JsStack>
          <Stack.Protected guard={isAuthenticated}>
            <JsStack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
          </Stack.Protected>
          <Stack.Screen name="(screens)" />
          <Stack.Protected guard={!isAuthenticated}>
            <JsStack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
          </Stack.Protected>
          <JsStack.Screen name="+not-found" />
        </JsStack>
      </View>
    </ThemeProvider>
  );
}

function RootLayout() {
  return (
    <ErrorBoundary>
      <KeyboardProvider>
        <AppProvider>
          <InitialLayout />
        </AppProvider>
      </KeyboardProvider>
    </ErrorBoundary>
  );
}
export default RootLayout;
