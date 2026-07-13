import type { StudentProfile } from '@features/main/types/student-profile';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { ApiResponse } from '@shared/apis/type';

export const getStudentProfile = async () => {
  const response = await request.get<ApiResponse<StudentProfile>>(ENDPOINT.STUDENTS.ME);

  return response.data;
};
