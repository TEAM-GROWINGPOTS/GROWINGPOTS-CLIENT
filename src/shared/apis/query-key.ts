export const QUERY_KEY = {
  STUDENTS: {
    ALL: ['students'] as const,
    ME: () => [...QUERY_KEY.STUDENTS.ALL, 'me'] as const,
    ME_COURSES: () => [...QUERY_KEY.STUDENTS.ALL, 'me', 'courses'] as const,
  },
} as const;
