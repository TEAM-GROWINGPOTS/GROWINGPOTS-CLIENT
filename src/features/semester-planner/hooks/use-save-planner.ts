'use client';

import { savePlanner } from '@features/semester-planner/apis/save-planner';
import type { PlannedTermResponse } from '@features/semester-planner/types/planner';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const getServerPlannedTerms = (data: unknown): PlannedTermResponse[] | null => {
  if (data && typeof data === 'object' && 'plannedTerms' in data) {
    return (data as { plannedTerms: PlannedTermResponse[] }).plannedTerms;
  }
  return null;
};

export const useSavePlanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePlanner,
    onSuccess: (data) => {
      if (data?.graduation) {
        queryClient.setQueryData(QUERY_KEY.GRADUATION.STATUS({ source: 'PLANNED' }), data.graduation);
        return;
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.GRADUATION.ALL });
    },
  });
};
