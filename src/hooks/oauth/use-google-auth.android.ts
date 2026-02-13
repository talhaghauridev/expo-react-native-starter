import { authApi } from '@/api/auth';
import { env } from '@/env';
import { useAuthStore } from '@/stores/auth-store';
import {
  GoogleSignin,
  isCancelledResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export const useGoogleAuth = () => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ idToken }: { idToken: string }) => authApi.verifyGoogleToken(idToken),
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.message || 'An unexpected error occurred. Please try again.',
      });
      signOut();
    },
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      offlineAccess: true,
      scopes: ['email'],
    });
  }, []);

  async function signIn() {
    setIsAuthenticating(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (isSuccessResponse(userInfo)) {
        console.log('Google User Info:', JSON.stringify(userInfo, null, 2));
        setAuthData(userInfo);
        if (!userInfo.data?.idToken) {
          Toast.show({
            type: 'error',
            text1: 'Google Login Failed',
            text2: 'Could not retrieve authentication token. Please try again.',
          });
          return;
        }

        const response = await mutateAsync({ idToken: userInfo.data?.idToken });

        const { message, data } = response;
        const { user, accessToken, refreshToken } = data;

        if (user && accessToken && refreshToken) {
          setCredentials(user, accessToken, refreshToken);
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: message,
          });
          router.replace('/');
        }
      } else if (isCancelledResponse(userInfo)) {
        console.log('User cancelled the login process.');
      }
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: 'info',
          text1: 'Sign In In Progress',
          text2: 'A sign-in attempt is already in progress.',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Play Services Unavailable',
          text2: 'Google Play services are not available or outdated.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign In Error',
          text2: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function signOut() {
    try {
      await GoogleSignin.signOut();
    } catch (err) {
      console.warn(err);
    }
  }

  return {
    authData,
    signIn,
    signOut,
    isLoading: isAuthenticating || isPending,
  };
};
