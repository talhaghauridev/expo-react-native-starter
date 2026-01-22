import AsyncStorage from '@react-native-async-storage/async-storage';

let createMMKV: any = null;
let mmkvStorage: any = null;
let isMMKVAvailable = false;

try {
  const MMKVModule = require('react-native-mmkv');
  createMMKV = MMKVModule.createMMKV;

  mmkvStorage = createMMKV();
  isMMKVAvailable = true;
  console.log('✅ Using MMKV');
} catch (error) {
  console.log('⚠️ MMKV not available');
  isMMKVAvailable = false;
}

export const StorageService = {
  setItem: async (key: string, value: string): Promise<void> => {
    if (isMMKVAvailable && mmkvStorage) {
      mmkvStorage.set(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  getItem: async (key: string): Promise<string | null | undefined> => {
    if (isMMKVAvailable && mmkvStorage) {
      return mmkvStorage.getString(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  setObject: async (key: string, value: any): Promise<void> => {
    const jsonValue = JSON.stringify(value);
    if (isMMKVAvailable && mmkvStorage) {
      mmkvStorage.set(key, jsonValue);
    } else {
      await AsyncStorage.setItem(key, jsonValue);
    }
  },

  getObject: async <T = any>(key: string): Promise<T | null> => {
    try {
      let jsonValue: string | null | undefined;

      if (isMMKVAvailable && mmkvStorage) {
        jsonValue = mmkvStorage.getString(key);
      } else {
        jsonValue = await AsyncStorage.getItem(key);
      }

      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch {
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    if (isMMKVAvailable && mmkvStorage) {
      mmkvStorage.delete(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },

  clear: async (): Promise<void> => {
    if (isMMKVAvailable && mmkvStorage) {
      mmkvStorage.clearAll();
    } else {
      await AsyncStorage.clear();
    }
  },

  isUsingMMKV: (): boolean => {
    return isMMKVAvailable;
  },

  getAllKeys: async (): Promise<string[]> => {
    if (isMMKVAvailable && mmkvStorage) {
      return mmkvStorage.getAllKeys();
    } else {
      return [...((await AsyncStorage.getAllKeys()) || [])];
    }
  },

  contains: (key: string): boolean => {
    if (isMMKVAvailable && mmkvStorage) {
      return mmkvStorage.contains(key);
    }
    return false;
  },
};

export { mmkvStorage as storage };
export { isMMKVAvailable };
