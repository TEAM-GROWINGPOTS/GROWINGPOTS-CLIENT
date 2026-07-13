export const QUERY_KEY = {
  STUDENTS: {
    ALL: ['students'] as const,
    ME: () => [...QUERY_KEY.STUDENTS.ALL, 'me'] as const,
  },
} as const;
