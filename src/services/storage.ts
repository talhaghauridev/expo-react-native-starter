import { createMMKV } from 'react-native-mmkv';

const mmkvStorage = createMMKV();

export const storageService = {
  setItem: (key: string, value: string) => {
    mmkvStorage.set(key, value);
  },

  getItem: (key: string) => {
    return mmkvStorage.getString(key);
  },

  setObject: (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    mmkvStorage.set(key, jsonValue);
  },

  getObject: (key: string) => {
    try {
      const jsonValue = mmkvStorage.getString(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch {
      return null;
    }
  },

  removeItem: (key: string) => {
    mmkvStorage.remove(key);
  },

  clear: () => {
    mmkvStorage.clearAll();
  },

  getAllKeys: (): string[] => {
    return mmkvStorage.getAllKeys();
  },

  contains: (key: string): boolean => {
    return mmkvStorage.contains(key);
  },
};

export { mmkvStorage as storage };
