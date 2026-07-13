import type { StudentProfile } from '@features/main/types/student-profile';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export const getStudentProfile = async () => {
  const response = await request.get<SuccessResponse<StudentProfile>>(ENDPOINT.STUDENTS.ME);

  return response.data;
};
