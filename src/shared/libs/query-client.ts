import { toast } from '@shared/components/toast';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

const handleGlobalError = () => {
  toast.negative('요청에 실패했어요.');
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
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
