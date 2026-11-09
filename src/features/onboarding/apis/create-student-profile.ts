import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import { type SuccessResponse } from '@shared/apis/type';

import { type StudentProfileCreateRequest, type StudentProfileCreateResponse } from '../types/onboarding';

export const createStudentProfile = async (body: StudentProfileCreateRequest) => {
  const response = await request.post<SuccessResponse<StudentProfileCreateResponse>>(ENDPOINT.STUDENTS.CREATE, body);

  return response.data;
};
