'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { createQueryClient } from '@shared/libs/query-client';

const queryClient = createQueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default Providers;
