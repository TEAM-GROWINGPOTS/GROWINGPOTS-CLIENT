'use client';

import { registerRefreshHandler, setAccessToken } from '@shared/apis/auth-token';
import { AUTH_REQUEST_CONTEXT, kyClient } from '@shared/apis/ky-client';
import { useAuthStore } from '@shared/stores/auth-store';
import { useEffect, useRef } from 'react';

export const useSessionRestore = () => {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    registerRefreshHandler(async () => {
      const { data } = await kyClient
        .post('api/v1/auth/reissue', { context: AUTH_REQUEST_CONTEXT })
        .json<{ data: { accessToken: string } }>();
      if (!data?.accessToken) throw new Error('accessToken 없음');
      setAccessToken(data.accessToken);
      return data.accessToken;
    });

    const restoreSession = async () => {
      try {
        const { data } = await kyClient
          .post('api/v1/auth/reissue', { context: AUTH_REQUEST_CONTEXT })
          .json<{ data: { accessToken: string } }>();

        if (!data?.accessToken) throw new Error('accessToken 없음');

        setAccessToken(data.accessToken);

        const nickname = document.cookie
          .split('; ')
          .find((row) => row.startsWith('nickname='))
          ?.split('=')[1];
        const onboardingCompleted = document.cookie
          .split('; ')
          .find((row) => row.startsWith('onboardingCompleted='))
          ?.split('=')[1];

        setAuthenticated(nickname ? decodeURIComponent(nickname) : '', onboardingCompleted === 'true');
      } catch {
        setUnauthenticated();
      }
    };

    restoreSession();
  }, [setAuthenticated, setUnauthenticated]);
};
