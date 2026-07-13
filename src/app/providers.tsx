'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { createQueryClient } from '@shared/libs/query-client';
import { useAuthStore } from '@shared/stores/auth-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);

  useEffect(() => {
    const nickname = document.cookie
      .split('; ')
      .find((row) => row.startsWith('nickname='))
      ?.split('=')[1];
    if (nickname) setAuthInfo(decodeURIComponent(nickname), true);
  }, [setAuthInfo]);

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
