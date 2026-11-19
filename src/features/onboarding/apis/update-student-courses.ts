import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { EmptySuccessResponse } from '@shared/apis/type';

import type { PutStudentCoursesRequest } from '../types/course';

export const updateStudentCourses = (body: PutStudentCoursesRequest) =>
  request.put<EmptySuccessResponse>(ENDPOINT.STUDENTS.ME_COURSES, body);
