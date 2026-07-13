export const QUERY_KEY = {
  GRADUATION: {
    ALL: ['graduation'] as const,
    STATUS: (params: object) => [...QUERY_KEY.GRADUATION.ALL, 'status', params] as const,
    COURSES: (divisionCode: string, params: object) =>
      [...QUERY_KEY.GRADUATION.ALL, 'courses', divisionCode, params] as const,
  },
};
