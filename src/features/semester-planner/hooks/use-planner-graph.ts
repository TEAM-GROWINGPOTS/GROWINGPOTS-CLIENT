'use client';

import { PLANNER_NODE_MOCK } from '@features/semester-planner/mock/planner-node-mock';
import { buildPlannerGraph, type PlannerGraph } from '@features/semester-planner/utils/build-planner-graph';
import { useMemo } from 'react';

export const usePlannerGraph = (): PlannerGraph => {
  // TODO: store나 API 응답으로 교체
  const data = PLANNER_NODE_MOCK;
  return useMemo(() => buildPlannerGraph(data), [data]);
};
