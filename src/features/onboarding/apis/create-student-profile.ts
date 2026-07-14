import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import { type SuccessResponse } from '@shared/apis/type';

import { type CreateStudentProfileRequest, type StudentProfile } from '../types/onboarding';

export const createStudentProfile = async (body: CreateStudentProfileRequest) => {
  const response = await request.post<SuccessResponse<StudentProfile>>(ENDPOINT.STUDENTS.CREATE, body);

  return response.data;
};
