import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserCredentials = {
  idInstance: string | null;
  apiTokenInstance: string | null;
};

export interface UserStore {
  credentials: UserCredentials;
  isAuth: boolean;
  setCredentials: (credentials: UserCredentials) => void;
}

export const useUser = create<UserStore>()(
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
    }),
    {
      name: 'user',
    },
  ),
);
