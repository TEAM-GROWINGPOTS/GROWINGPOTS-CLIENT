export const QUERY_KEY = {
  GRADUATION: {
    ALL: ['graduation'] as const,
    DETAIL: (params: object) => [...QUERY_KEY.GRADUATION.ALL, params] as const,
    COURSES: (divisionCode: string, params: object) =>
      [...QUERY_KEY.GRADUATION.ALL, 'courses', divisionCode, params] as const,
  },
};
