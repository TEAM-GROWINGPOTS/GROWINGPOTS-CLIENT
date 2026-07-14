export const QUERY_KEY = {
  ONBOARDING: {
    ALL: ['onboarding'] as const,
    OPTIONS: () => [...QUERY_KEY.ONBOARDING.ALL, 'options'] as const,
  },
  COURSES: {
    ALL: ['courses'] as const,
    SEARCH: (params: object) => [...QUERY_KEY.COURSES.ALL, 'search', params] as const,
  },
  PLANNER: {
    ALL: ['planner'] as const,
  },
  GRADUATION: {
    ALL: ['graduation'] as const,
    STATUS: (params: object) => [...QUERY_KEY.GRADUATION.ALL, 'status', params] as const,
    SCOPED_OPTIONS: (schoolId?: number) => [...QUERY_KEY.ONBOARDING.ALL, 'options', 'scoped', schoolId] as const,
  },
};
