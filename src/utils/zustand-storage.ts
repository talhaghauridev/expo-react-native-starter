import { storage } from '@/services/storage';
import { StateStorage, createJSONStorage as createZustandStorage } from 'zustand/middleware';

export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

const zustandStorage = createZustandStorage(() => mmkvStorage);

export default zustandStorage;
