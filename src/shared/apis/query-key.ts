import type { GraduationQueryParams } from './types/graduation';

export const QUERY_KEY = {
  STUDENTS: {
    ALL: ['students'] as const,
    ME: () => [...QUERY_KEY.STUDENTS.ALL, 'me'] as const,
    ME_COURSES: () => [...QUERY_KEY.STUDENTS.ALL, 'me', 'courses'] as const,
    ME_GRADUATION: (params?: GraduationQueryParams) => [...QUERY_KEY.STUDENTS.ALL, 'me', 'graduation', params] as const,
  },
  ONBOARDING: {
    ALL: ['onboarding'] as const,
    OPTIONS: () => [...QUERY_KEY.ONBOARDING.ALL, 'options'] as const,
    SCOPED_OPTIONS: (schoolId?: number) => [...QUERY_KEY.ONBOARDING.ALL, 'options', 'scoped', schoolId] as const,
  },
  COURSES: {
    ALL: ['courses'] as const,
    SEARCH: (params: object) => [...QUERY_KEY.COURSES.ALL, 'search', params] as const,
  },
  PLANNER: {
    ALL: ['planner'] as const,
  },
  STUDENT_PROFILE: {
    ME: ['student-profile', 'me'] as const,
  },
  GRADUATION: {
    ALL: ['graduation'] as const,
    STATUS: (params: object) => [...QUERY_KEY.GRADUATION.ALL, 'status', params] as const,
    COURSES: (divisionCode: string, params: object) =>
      [...QUERY_KEY.GRADUATION.ALL, 'courses', divisionCode, params] as const,
  },
};
