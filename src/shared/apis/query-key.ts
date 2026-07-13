export const QUERY_KEY = {
  ONBOARDING: {
    ALL: ['onboarding'] as const,
    OPTIONS: (schoolId?: number) => [...QUERY_KEY.ONBOARDING.ALL, 'options', schoolId] as const,
  },
};
