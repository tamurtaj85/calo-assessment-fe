import { AuthContext } from '@/providers/context';
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export const AuthGuard = () => {
  const { userData } = useContext(AuthContext);

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!userData?.user || !userData?.accessToken) {
      navigateTo('/authenticate');
      return;
    }
  }, [userData, navigateTo]);

  return (
    <>
      <Outlet />
    </>
  );
};
