import type { GraduationResponse } from '@shared/apis/types/graduation';

export const createGraduationResponse = (overrides: Partial<GraduationResponse> = {}): GraduationResponse => ({
  summary: {
    totalCredits: { current: 60, required: 130 },
    gpa: { current: 3.5, min: null },
    enrollmentStatus: '재학',
  },
  graduatable: false,
  curriculumSatisfied: false,
  conditions: null,
  graduationRequired: null,
  sections: null,
  certs: [],
  ...overrides,
});
