import { ToastItem } from '@shared/components/toast/toast-item';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';

const handleGlobalError = () => {
  sonnerToast.custom(() => <ToastItem variant="negative" message="요청에 실패했어요." />, {
    id: 'global-query-error',
  });
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
