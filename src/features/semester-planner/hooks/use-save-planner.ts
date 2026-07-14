'use client';

import { savePlanner } from '@features/semester-planner/apis/save-planner';
import type { PlannedTermResponse } from '@features/semester-planner/types/planner';
import { parseApiError } from '@shared/apis/parse-api-error';
import { QUERY_KEY } from '@shared/apis/query-key';
import { toast } from '@shared/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseSavePlannerInput {
  onSaveError?: (serverPlannedTerms: PlannedTermResponse[] | null) => void;
}

const getServerPlannedTerms = (data: unknown): PlannedTermResponse[] | null => {
  if (data && typeof data === 'object' && 'plannedTerms' in data) {
    return (data as { plannedTerms: PlannedTermResponse[] }).plannedTerms;
  }
  return null;
};

export const useSavePlanner = ({ onSaveError }: UseSavePlannerInput = {}) => {
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
    onError: async (error) => {
      const parsed = await parseApiError(error);
      toast.negative(parsed?.message ?? '플래너 저장에 실패했어요.');
      onSaveError?.(getServerPlannedTerms(parsed?.data));
    },
  });
};
