import type { PlannerResponse } from '@features/semester-planner/types/planner';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export const getPlanner = async () => {
  const response = await request.get<SuccessResponse<PlannerResponse>>(ENDPOINT.PLANNER.ROOT);

  return response.data;
};
