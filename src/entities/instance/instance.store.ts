import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StoredInstanceCredentials = {
  idInstance: string | null;
  apiTokenInstance: string | null;
};

export interface InstanceStore {
  credentials: StoredInstanceCredentials;
  isAuth: boolean;
  setCredentials: (credentials: StoredInstanceCredentials) => void;
  clearCredentials: () => void;
}

export const useInstanceStore = create<InstanceStore>()(
  persist(
    (set) => ({
      credentials: {
        idInstance: null,
        apiTokenInstance: null,
      },
      isAuth: false,
      setCredentials: (credentials) =>
        set({
          credentials,
          isAuth: Boolean(credentials.idInstance && credentials.apiTokenInstance),
        }),
      clearCredentials: () =>
        set({
          credentials: {
            idInstance: null,
            apiTokenInstance: null,
          },
          isAuth: false,
        }),
    }),
    {
      name: 'instance',
    },
  ),
);
