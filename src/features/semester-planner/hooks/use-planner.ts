'use client';

import { getPlanner } from '@features/semester-planner/api/get-planner';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const usePlanner = () =>
  useQuery({
    queryKey: QUERY_KEY.PLANNER.ALL,
    queryFn: getPlanner,
  });
