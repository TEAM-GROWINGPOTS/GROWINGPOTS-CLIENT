import { toast } from '@shared/components/toast';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isHTTPError } from 'ky';

const handleGlobalError = () => {
  toast.negative('요청에 실패했어요.', { id: 'global-query-error' });
};

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: handleGlobalError,
    }),
    mutationCache: new MutationCache({
      onError: handleGlobalError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
          if (isHTTPError(error) && error.response.status >= 400) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
