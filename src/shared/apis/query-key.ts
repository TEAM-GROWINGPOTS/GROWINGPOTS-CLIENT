export const QUERY_KEY = {
  STUDENTS: {
    ALL: ['students'] as const,
    ME: () => [...QUERY_KEY.STUDENTS.ALL, 'me'] as const,
    ME_COURSES: () => [...QUERY_KEY.STUDENTS.ALL, 'me', 'courses'] as const,
  },
  ONBOARDING: {
    ALL: ['onboarding'] as const,
    OPTIONS: () => [...QUERY_KEY.ONBOARDING.ALL, 'options'] as const,
    SCOPED_OPTIONS: (schoolId?: number) => [...QUERY_KEY.ONBOARDING.ALL, 'options', 'scoped', schoolId] as const,
  },
};
