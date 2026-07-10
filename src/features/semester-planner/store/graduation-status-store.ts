import type {
  DoubleMajorData,
  GraduationCondition,
  GraduationStatusData,
  GraduationStatusState,
} from '@features/semester-planner/types/graduation-status';
import { create } from 'zustand';

const MOCK_GRADUATION_REQUIRED_CONDITIONS: GraduationCondition[] = [
  { code: 'GRAD_REQUIRED_PE', name: '전문실기', current: 2, required: 4, satisfied: false, unit: '과목' },
  { code: 'GRAD_REQUIRED_GYM', name: '맨손체조', current: 0, required: 1, satisfied: false, unit: '과목' },
];

const MOCK_OTHER_REQUIRED_CONDITIONS: GraduationCondition[] = [
  { code: 'OTHER_REQUIRED_SW', name: 'SW 인증', current: 6, required: 6, satisfied: true, unit: '학점' },
  { code: 'OTHER_REQUIRED_ENGLISH', name: '영어강의', current: 7, required: 3, satisfied: true, unit: '과목' },
];

const MOCK_NON_MAJOR_CONDITIONS: GraduationCondition[] = [
  { code: 'GENERAL', name: '교양', current: 42, required: 110, satisfied: false, unit: '학점' },
  { code: 'DISTRIBUTED_GE', name: '배분이수교과', current: 5, required: 13, satisfied: false, unit: '학점' },
  { code: 'REQUIRED_GE', name: '필수교과', current: 32, required: 55, satisfied: false, unit: '학점' },
  { code: 'FREE_GE', name: '자유이수교과', current: 27, required: 42, satisfied: false, unit: '학점' },
];

const MOCK_MAIN_MAJOR: GraduationStatusData = {
  summary: {
    totalCredits: { current: 86, required: 120 },
    gpa: { current: 4.08, min: 1.7 },
    enrollmentStatus: '재학 중',
  },
  conditions: [
    { code: 'MAJOR', name: '전공', current: 32, required: 55, satisfied: false, unit: '학점' },
    { code: 'MAJOR_BASIC', name: '전공기초', current: 12, required: 10, satisfied: true, unit: '학점' },
    { code: 'MAJOR_REQUIRED', name: '전공필수', current: 5, required: 13, satisfied: false, unit: '학점' },
    { code: 'MAJOR_ELECTIVE', name: '전공선택', current: 27, required: 42, satisfied: false, unit: '학점' },
    ...MOCK_NON_MAJOR_CONDITIONS,
    ...MOCK_GRADUATION_REQUIRED_CONDITIONS,
    ...MOCK_OTHER_REQUIRED_CONDITIONS,
  ],
  overallMet: false,
};

const MOCK_DOUBLE_MAJOR: DoubleMajorData = {
  conditions: [
    { code: 'MAJOR', name: '전공', current: 36, required: 36, satisfied: true, unit: '학점' },
    { code: 'MAJOR_BASIC', name: '전공기초', current: 6, required: 6, satisfied: true, unit: '학점' },
    { code: 'MAJOR_REQUIRED', name: '전공필수', current: 12, required: 12, satisfied: true, unit: '학점' },
    { code: 'MAJOR_ELECTIVE', name: '전공선택', current: 18, required: 18, satisfied: true, unit: '학점' },
  ],
};

export const useGraduationStatusStore = create<GraduationStatusState>((set) => ({
  mainMajor: MOCK_MAIN_MAJOR,
  doubleMajor: MOCK_DOUBLE_MAJOR,
  setMainMajor: (data) => set({ mainMajor: data }),
  setDoubleMajor: (data) => set({ doubleMajor: data }),
}));
