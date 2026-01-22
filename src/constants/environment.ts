import { Platform } from 'react-native';

export const IS_DEV = __DEV__;
export const IS_PROD = !__DEV__;

export const IS_TEST = process.env.NODE_ENV === 'test';

export const IS_EXPO_GO = !process.env.EXPO_PUBLIC_APP_VARIANT;

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_WEB = Platform.OS === 'web';
