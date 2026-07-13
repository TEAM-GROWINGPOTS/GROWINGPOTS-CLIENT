import { toast } from '@shared/components/toast';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: () => {
        toast.negative('요청에 실패했어요.');
      },
    }),
    mutationCache: new MutationCache({
      onError: () => {
        toast.negative('요청에 실패했어요.');
      },
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
