import { createMMKV } from 'react-native-mmkv';

const mmkvStorage = createMMKV();

export const StorageService = {
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
      let jsonValue: string | null | undefined;

      jsonValue = mmkvStorage.getString(key);

      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch {
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    mmkvStorage.remove(key);
  },

  clear: async (): Promise<void> => {
    mmkvStorage.clearAll();
  },

  getAllKeys: async (): Promise<string[]> => {
    return mmkvStorage.getAllKeys();
  },

  contains: (key: string): boolean => {
    return mmkvStorage.contains(key);
  },
};

export { mmkvStorage as storage };
