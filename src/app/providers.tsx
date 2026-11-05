'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { registerRefreshHandler, setAccessToken } from '@shared/apis/auth-token';
import { AUTH_REQUEST_CONTEXT, kyClient } from '@shared/apis/ky-client';
import { createQueryClient } from '@shared/libs/query-client';
import { useAuthStore } from '@shared/stores/auth-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useRef, useState } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());
  const { setAuthenticated, setUnauthenticated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

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

    registerRefreshHandler(async () => {
      const { data } = await kyClient
        .post('api/v1/auth/reissue', { context: AUTH_REQUEST_CONTEXT })
        .json<{ data: { accessToken: string } }>();
      if (!data?.accessToken) throw new Error('accessToken 없음');
      setAccessToken(data.accessToken);
      return data.accessToken;
    });

    restoreSession();
  }, [setAuthenticated, setUnauthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={300}>
        {children}
        {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
      </Tooltip.Provider>
    </QueryClientProvider>
  );
};

export default Providers;
