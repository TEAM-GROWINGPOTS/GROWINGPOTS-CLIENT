'use client';

import { savePlanner } from '@features/semester-planner/api/save-planner';
import { QUERY_KEY } from '@shared/apis/query-key';
import { toast } from '@shared/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSavePlanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePlanner,
    onSuccess: (graduation) => {
      if (graduation) {
        queryClient.setQueryData(QUERY_KEY.GRADUATION.STATUS({ source: 'PLANNED' }), graduation);
        return;
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.GRADUATION.ALL });
    },
    onError: () => {
      toast.negative('플래너 저장에 실패했어요.');
    },
  });
};
