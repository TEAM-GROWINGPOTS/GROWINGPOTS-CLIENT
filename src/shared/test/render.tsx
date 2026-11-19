import * as Tooltip from '@radix-ui/react-tooltip';
import { createTestQueryClient } from '@shared/test/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';

// app/providers.tsx 구성과 동일하게 유지한다. 전역 toast와 Devtools만 뺀다.
const createWrapper = () => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={300}>{children}</Tooltip.Provider>
    </QueryClientProvider>
  );

  return Wrapper;
};

export const renderWithProviders = (ui: ReactElement) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: createWrapper() }),
});

export const renderHookWithProviders = <Result,>(hook: () => Result) => renderHook(hook, { wrapper: createWrapper() });
