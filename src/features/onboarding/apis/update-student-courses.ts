import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessUnion } from '@shared/apis/type';

import type { PutStudentCoursesRequest, StudentCourses } from '../types/course';

export const updateStudentCourses = (body: PutStudentCoursesRequest) =>
  request.put<SuccessUnion<StudentCourses>>(ENDPOINT.STUDENTS.ME_COURSES, body).then((response) => response.data);
