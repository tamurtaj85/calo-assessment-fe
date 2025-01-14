import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
  toast,
} from '@/components/ui';
import { useFetch } from '@/hooks/useAppUtils';
import { cn, getErrorResponseMessage } from '@/lib/utils';
import { AuthContext } from '@/providers/context';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const Authenticate = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [authData, setAuthData] = useState({ email: '', password: '' });

  const { persistUserData } = useContext(AuthContext);

  const navigateTo = useNavigate();

  const { isLoading, isSuccess, isError, data, error, fetcher } =
    useFetch('user/authenticate');

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        data?.statusCode === 200 ? 'Welcome back' : 'Welcome onboard'
      );

      persistUserData?.({
        user: data?.data?.user,
        accessToken: data?.data?.accessToken,
      });

      navigateTo('/app/transfer-market');
    }
  }, [isSuccess, data, navigateTo, persistUserData]);

  useEffect(() => {
    if (isError) {
      toast.error(getErrorResponseMessage(error));
    }
  }, [isError, error]);

  const handleOnInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [event.target.name]: event.target.value });
  };

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();

    fetcher({ method: 'post', data: authData });
  };

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Authenticate</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOnSubmit}>
                <div className='flex flex-col gap-6'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      name='email'
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      required
                      value={authData.email}
                      onChange={handleOnInputChange}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                    </div>
                    <Input
                      name='password'
                      id='password'
                      type='password'
                      placeholder='type your password'
                      required
                      value={authData.password}
                      onChange={handleOnInputChange}
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    {isLoading && <Spinner />} Login / Register
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
