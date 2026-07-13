import type { PlannerResponse } from '@features/semester-planner/types/planner';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export const getPlanner = () => request.get<SuccessResponse<PlannerResponse>>('planner');
