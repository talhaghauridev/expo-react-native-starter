import { authApi } from '@/api/auth';
import { AvailableOAuthProviders } from '@/constants/constants';
import { OAuthPayload, OAuthProvider } from '@/types/auth';
import * as Linking from 'expo-linking';
import { usePathname } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export interface AuthData {
  access_token: string;
  refresh_token: string;
}

interface UseOAuthOptions {
  onSuccess?: (data: AuthData) => void;
  onError?: (error: string) => void;
  provider: OAuthProvider;
}

export const useOAuth = ({ provider, onSuccess, onError }: UseOAuthOptions) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const hasRedirected = useRef(false);
  const linkingSubscription = useRef<any>(null);
  const pathname = usePathname();
  // Initialize WebBrowser
  useEffect(() => {
    if (Platform.OS !== 'web') {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);
  const parseAuthData = useCallback((queryParams: Record<string, any>): AuthData => {
    return Object.entries(queryParams).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as AuthData
    );
  }, []);

  // Handle deep linking
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      if (hasRedirected.current) return;

      const data = Linking.parse(event.url);
      if (!data.queryParams) return;

      const authData: AuthData = parseAuthData(data.queryParams);

      if (authData.access_token) {
        handleAuthSuccess(authData);
      } else if (data.queryParams.error) {
        handleAuthError(data.queryParams.error as string);
      }
    };

    linkingSubscription.current = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && !hasRedirected.current) {
        handleDeepLink({ url });
      }
    });

    return () => {
      if (linkingSubscription.current?.remove) {
        linkingSubscription.current.remove();
      }
    };
  }, []);

  const handleAuthSuccess = useCallback(
    (data: AuthData) => {
      if (hasRedirected.current) return;

      try {
        hasRedirected.current = true;
        setAuthData(data);
        setIsAuthenticating(false);
        onSuccess?.(data);
      } catch (error) {
        console.error('Error handling auth success:', error);
        handleAuthError('Failed to process authentication data');
      }
    },
    [onSuccess]
  );

  const handleAuthError = useCallback(
    (errorMessage: string) => {
      if (hasRedirected.current) return;
      setError(errorMessage);
      setIsAuthenticating(false);
      onError?.(errorMessage);
    },
    [onError]
  );

  const signIn = useCallback(
    async (options?: OAuthPayload) => {
      if (provider && !AvailableOAuthProviders.includes(provider)) {
        handleAuthError('Invalid OAuth Provider');
        return;
      }

      if (isAuthenticating) {
        console.warn('Login already in progress');
        return;
      }

      try {
        setIsAuthenticating(true);
        setError(null);
        hasRedirected.current = false;

        const redirectUrl = options?.redirectUrl ?? Linking.createURL(pathname);

        const { data } = await authApi.getOAuthLoginUrl({
          redirectUrl,
          provider,
        });

        if (!data?.authUrl) {
          handleAuthError('Unable to initialize login. Please try again.');
          return;
        }

        const result = await WebBrowser.openAuthSessionAsync(data.authUrl, redirectUrl);

        console.log('OAuth result:', result);

        if (result.type === 'cancel' || result.type === 'dismiss') {
          console.log('User cancelled login');
          return;
        }

        if (result.type !== 'success') {
          handleAuthError('Unable to complete login. Please try again.');
        }
      } catch (error: any) {
        console.error(`Error during ${provider} Sign-In:`, error);
        handleAuthError(error?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        if (!hasRedirected.current) {
          setIsAuthenticating(false);
        }
      }
    },
    [isAuthenticating, provider, pathname, handleAuthError]
  );

  return {
    isAuthenticating,
    error,
    authData,
    isAuthenticated: !!authData?.access_token,
    signIn,
  };
};
