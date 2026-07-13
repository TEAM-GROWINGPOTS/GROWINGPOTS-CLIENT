export const ENDPOINT = {
  STUDENTS: {
    ME: '/api/v1/students/me',
  },
  GRADUATION: {
    STATUS: '/api/v1/students/me/graduation',
    COURSES: (divisionCode: string) => `/api/v1/students/me/graduation/${divisionCode}/courses`,
  },
};
