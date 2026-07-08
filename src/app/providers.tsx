'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { createQueryClient } from '@shared/libs/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());

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
