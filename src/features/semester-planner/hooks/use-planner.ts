'use client';

import { getPlanner } from '@features/semester-planner/api/get-planner';
import { useQuery } from '@tanstack/react-query';

export const usePlanner = () =>
  useQuery({
    queryKey: ['planner'],
    queryFn: getPlanner,
  });
