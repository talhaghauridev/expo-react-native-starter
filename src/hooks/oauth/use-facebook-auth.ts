import { OAuthProviderType } from '@/constants/constants';
import { useAuthStore } from '@/stores/auth-store';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useUser } from '../use-user';
import { AuthData, useOAuth } from './use-oauth';

export const useFacebookAuth = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const { refetch, isLoading, data } = useUser();

  const onSuccess = (data: AuthData) => {
    setToken({ access_token: data.access_token, refresh_token: data.refresh_token });

    refetch();
  };

  const { authData, signIn, isAuthenticating } = useOAuth({
    provider: OAuthProviderType.FACEBOOK,
    onSuccess,
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err,
        autoHide: true,
      });
    },
  });

  const handleRedirect = () => {
    if (!isAuthenticating && !isLoading) {
      if (authData?.access_token && data?.data.user) {
        setUser(data?.data.user);
        router.replace('/');
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'You have successfully logged in with Facebook.',
        });
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRedirect();
    }, [handleRedirect])
  );
  return {
    authData,
    signIn,
    isLoading: isAuthenticating || isLoading,
  };
};
