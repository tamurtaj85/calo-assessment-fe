import { LocalStorageService } from '@/services/localStorage';
import React, { ComponentPropsWithoutRef, useCallback, useState } from 'react';
import { AuthContext } from './context';

export const AuthProvider: React.FC<
  Pick<ComponentPropsWithoutRef<'div'>, 'children'>
> = ({ children }) => {
  const [authData, setAuthData] = useState({
    user: LocalStorageService.getItem('user'),
    accessToken: LocalStorageService.getItem('accessToken'),
  });

  const persistUserData = useCallback(
    (data: Record<'user' | 'accessToken', unknown | any>) => {
      setAuthData(data);
      LocalStorageService.setItem('user', data?.user);
      LocalStorageService.setItem('accessToken', data?.accessToken);
    },
    []
  );

  const removeUserData = useCallback(() => {
    LocalStorageService.removeItem('user');
    LocalStorageService.removeItem('accessToken');
    setAuthData({ user: null, accessToken: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData: authData, persistUserData, removeUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
