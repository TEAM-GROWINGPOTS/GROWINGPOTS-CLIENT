import type { PlannerSaveRequest } from '@features/semester-planner/types/planner';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { GraduationResponse } from '@shared/apis/types/graduation';

export const savePlanner = (body: PlannerSaveRequest) =>
  request.put<SuccessResponse<GraduationResponse>>(ENDPOINT.PLANNER.ROOT, body);
