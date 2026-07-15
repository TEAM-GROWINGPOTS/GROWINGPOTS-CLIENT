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
    onSuccess: (data) => {
      if (data?.hasDuplicateCourse) {
        toast.notice('재수강 과목이에요. 기존 이수 학점은 제외되고 현재 학기에 반영돼요.');
      }
      if (data?.graduation) {
        queryClient.setQueryData(QUERY_KEY.GRADUATION.STATUS({ source: 'PLANNED' }), data.graduation);
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
