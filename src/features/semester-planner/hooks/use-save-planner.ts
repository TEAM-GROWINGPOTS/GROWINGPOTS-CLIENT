'use client';

import { savePlanner } from '@features/semester-planner/api/save-planner';
import { toast } from '@shared/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSavePlanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePlanner,
    onSuccess: (graduation) => {
      if (graduation) {
        queryClient.setQueryData(['graduation', 'PLANNED'], graduation);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['graduation'] });
    },
    onError: () => {
      toast.negative('플래너 저장에 실패했어요.');
    },
  });
};
