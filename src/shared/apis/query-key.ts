export const QUERY_KEY = {
  ONBOARDING: {
    ALL: ['onboarding'] as const,
    OPTIONS: () => [...QUERY_KEY.ONBOARDING.ALL, 'options'] as const,
    SCOPED_OPTIONS: (schoolId?: number) => [...QUERY_KEY.ONBOARDING.ALL, 'options', 'scoped', schoolId] as const,
  },
};
