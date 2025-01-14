import { LocalStorageService } from '@/services/localStorage';
import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useMemo, useRef, useState } from 'react';

export const useFetch = (url: string | URL) => {
  const [fetchState, setFetchState] = useState<{
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: Record<string, unknown | any> | null;
    error: null | unknown | any;
  }>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
    error: null,
  });

  const lastConfigsRef = useRef<AxiosRequestConfig>({});

  const fetcher = useCallback(
    async (configs: AxiosRequestConfig = {}) => {
      const { method = 'get', headers, ...restConfigs } = configs;

      setFetchState({
        isLoading: true,
        isSuccess: false,
        isError: false,
        data: null,
        error: null,
      });

      const token = LocalStorageService.getItem('accessToken');

      try {
        const defaultConfigs = {
          method,
          url: (import.meta.env.VITE_SERVER_URL ?? '/') + `/${url}`,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
          },
          ...restConfigs,
        };

        const res = await axios.request(defaultConfigs);

        setFetchState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          data: {
            statusText: res.statusText,
            statusCode: res.status,
            data: res.data,
          },
          error: null,
        });

        lastConfigsRef.current = defaultConfigs;
      } catch (error: unknown | any) {
        setFetchState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          data: null,
          error: {
            statusText: error?.response?.statusText,
            statusCode: error?.response?.status,
            data: error?.response?.data ?? error?.message,
          },
        });
      }
    },
    [url]
  );

  const refetch = useCallback(() => {
    fetcher(lastConfigsRef.current);
  }, [fetcher]);

  return useMemo(
    () => ({ ...fetchState, fetcher, refetch }),
    [fetchState, fetcher, refetch]
  );
};
