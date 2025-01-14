import { createContext } from 'react';

export const AuthContext = createContext<
  Partial<{
    userData: Record<string, unknown | any> | null;
    persistUserData: (
      data: Record<'user' | 'accessToken', unknown | any>
    ) => void;
    removeUserData: () => void;
  }>
>({});
