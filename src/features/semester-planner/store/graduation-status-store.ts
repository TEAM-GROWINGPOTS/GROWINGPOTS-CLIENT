import type {
  DoubleMajorData,
  GraduationCondition,
  GraduationStatusData,
  GraduationStatusState,
} from '@features/semester-planner/types/graduation-status';
import { create } from 'zustand';

const MOCK_NON_MAJOR_CONDITIONS: GraduationCondition[] = [
  { code: 'GENERAL', name: '교양', current: 64, required: 110, satisfied: false },
  { code: 'REQUIRED_GE', name: '필수교과', current: 32, required: 55, satisfied: false },
  { code: 'DISTRIBUTED_GE', name: '배부이수교과', current: 5, required: 13, satisfied: false },
  { code: 'FREE_GE', name: '자유이수교과', current: 27, required: 42, satisfied: false },
  { code: 'OTHER', name: '기타', current: 27, required: null, satisfied: false },
];

const MOCK_MAIN_MAJOR: GraduationStatusData = {
  summary: {
    totalCredits: { current: 32, required: 120 },
    gpa: { current: 4.08, min: 1.7 },
    enrollmentStatus: '재학 중',
  },
  conditions: [
    { code: 'MAJOR', name: '전공', current: 32, required: 55, satisfied: false },
    { code: 'MAJOR_REQUIRED', name: '전공필수', current: 5, required: 13, satisfied: false },
    { code: 'MAJOR_ELECTIVE', name: '전공선택', current: 27, required: 42, satisfied: false },
    { code: 'MAJOR_BASIC', name: '전공기초', current: 12, required: 10, satisfied: true },
    ...MOCK_NON_MAJOR_CONDITIONS,
  ],
  overallMet: false,
};

const MOCK_DOUBLE_MAJOR: DoubleMajorData = {
  conditions: [
    { code: 'MAJOR', name: '전공', current: 36, required: 36, satisfied: true },
    { code: 'MAJOR_REQUIRED', name: '전공필수', current: 12, required: 12, satisfied: true },
    { code: 'MAJOR_ELECTIVE', name: '전공선택', current: 18, required: 18, satisfied: true },
    { code: 'MAJOR_BASIC', name: '전공기초', current: 6, required: 6, satisfied: true },
  ],
};

export const useGraduationStatusStore = create<GraduationStatusState>((set) => ({
  mainMajor: MOCK_MAIN_MAJOR,
  doubleMajor: MOCK_DOUBLE_MAJOR,
  setMainMajor: (data) => set({ mainMajor: data }),
  setDoubleMajor: (data) => set({ doubleMajor: data }),
}));
