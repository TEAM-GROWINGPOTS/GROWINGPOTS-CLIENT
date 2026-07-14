'use client';

import type { PlannerTerm } from '@features/semester-planner/types/planner';
import { buildPlannerGraph, type PlannerGraph } from '@features/semester-planner/utils/build-planner-graph';
import { useMemo } from 'react';

export const usePlannerGraph = (completedTerms: PlannerTerm[], plannedTerms: PlannerTerm[]): PlannerGraph =>
  useMemo(() => buildPlannerGraph(completedTerms, plannedTerms), [completedTerms, plannedTerms]);
