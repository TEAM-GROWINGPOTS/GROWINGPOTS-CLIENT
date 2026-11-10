import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

import type { StudentCourses } from '../types/course';

export const getStudentCourses = () =>
  request.get<SuccessResponse<StudentCourses>>(ENDPOINT.STUDENTS.ME_COURSES).then((response) => response.data);
