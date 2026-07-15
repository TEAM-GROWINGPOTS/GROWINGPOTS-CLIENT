import type { PlannerSaveRequest, PlannerSaveResponse } from '@features/semester-planner/types/planner';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export const savePlanner = async (body: PlannerSaveRequest) => {
  const response = await request.put<SuccessResponse<PlannerSaveResponse>>(ENDPOINT.PLANNER.ROOT, body);

  return response.data;
};
