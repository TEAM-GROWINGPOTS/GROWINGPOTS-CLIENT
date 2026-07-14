export const QUERY_KEY = {
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
