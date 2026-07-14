export const ENDPOINT = {
  DIAGNOSIS: {
    UPLOAD: '/api/v1/diagnosis/upload',
  },
  ONBOARDING: {
    OPTIONS: '/api/v1/onboarding/options',
  },
  COURSES: {
    LIST: '/api/v1/courses',
  },
  PLANNER: {
    ROOT: '/api/v1/planner',
  },
  GRADUATION: {
    STATUS: '/api/v1/students/me/graduation',
    COURSES: (divisionCode: string) => `/api/v1/students/me/graduation/${divisionCode}/courses`,
  },
  STUDENTS: {
    CREATE: '/api/v1/students',
    ME: '/api/v1/students/me',
  },
};
