import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessUnion } from '@shared/apis/type';

import type { StudentProfile } from '../types/student-profile';

export const getStudentProfile = () =>
  request.get<SuccessUnion<StudentProfile>>(ENDPOINT.STUDENTS.ME).then((response) => response.data);
