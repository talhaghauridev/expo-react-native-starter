import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

type AnyError = Error | string | { message?: string; [key: string]: any } | any;

export const useErrorHandler = (error: AnyError | undefined): void => {
  const handleError = useCallback(() => {
    if (!error) return;

    if (typeof error === 'string') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        autoHide: true,
      });
    } else if (error.message) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred. Please try again.',
        autoHide: true,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('Logged error:', error);
    }
  }, [error]);

  useFocusEffect(
    useCallback(() => {
      handleError();
      return () => {
        // console.log('This route is now unfocused.');
      };
    }, [])
  );
};
