import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { StudentProfile } from '@shared/apis/types/student-profile';

export const getStudentProfile = () =>
  request.get<SuccessResponse<StudentProfile>>(ENDPOINT.STUDENTS.ME).then((response) => response.data);
