import type { GraduationResponse, MajorSection } from '@shared/apis/types/graduation';
import { create } from 'zustand';

interface GraduationStatusState {
  data: GraduationResponse | null;
  setData: (data: GraduationResponse) => void;
}

const PE_MAIN_MAJOR: MajorSection = {
  majorName: '스포츠의학과',
  majorType: 'MAIN',
  conditions: [
    {
      code: 'MAJOR_BASIC',
      name: '전공 기초',
      current: 6,
      required: 7,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
    {
      code: 'MAJOR_REQUIRED',
      name: '전공 필수',
      current: 9,
      required: 9,
      unit: 'CREDITS',
      satisfied: true,
      chartTarget: true,
    },
    {
      code: 'MAJOR_ELECTIVE',
      name: '전공 선택',
      current: 15,
      required: 51,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
    {
      code: 'ENGLISH_COURSE',
      name: '영어 강의',
      current: 5,
      required: 3,
      unit: 'COURSES',
      satisfied: true,
      chartTarget: true,
    },
    {
      code: 'SW_CERT_COURSE',
      name: 'SW 인증 강의',
      current: 0,
      required: 6,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
  ],
  graduationRequired: {
    hasGraduationRequired: true,
    satisfied: false,
    totalCredit: 2,
    unmetDescriptions: [],
    items: [
      { name: '전문실기', current: 1, required: 2, unit: 'COURSES', satisfied: false },
      { name: '맨손체조', current: 0, required: 1, unit: 'COURSES', satisfied: false },
    ],
  },
};

// 체육대학 외 학과는 별도 졸업 필수 항목이 없어 hasGraduationRequired가 false로 내려옴
const NON_PE_MAIN_MAJOR: MajorSection = {
  majorName: '컴퓨터공학과',
  majorType: 'MAIN',
  conditions: [
    {
      code: 'MAJOR_BASIC',
      name: '전공 기초',
      current: 6,
      required: 7,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
    {
      code: 'MAJOR_REQUIRED',
      name: '전공 필수',
      current: 9,
      required: 9,
      unit: 'CREDITS',
      satisfied: true,
      chartTarget: true,
    },
    {
      code: 'MAJOR_ELECTIVE',
      name: '전공 선택',
      current: 15,
      required: 51,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
    {
      code: 'ENGLISH_COURSE',
      name: '영어 강의',
      current: 5,
      required: 3,
      unit: 'COURSES',
      satisfied: true,
      chartTarget: true,
    },
    {
      code: 'SW_CERT_COURSE',
      name: 'SW 인증 강의',
      current: 0,
      required: 6,
      unit: 'CREDITS',
      satisfied: false,
      chartTarget: true,
    },
  ],
  graduationRequired: {
    hasGraduationRequired: false,
    satisfied: true,
    totalCredit: 0,
    unmetDescriptions: [],
    items: null,
  },
};

const MOCK_DATA: GraduationResponse = {
  summary: {
    totalCredits: { current: 44, required: 120 },
    gpa: { current: 2.788, min: 1.7 },
    enrollmentStatus: '재학',
  },
  graduatable: false,
  conditions: null,
  graduationRequired: null,
  sections: {
    majors: [
      PE_MAIN_MAJOR,
      {
        majorName: '연극영화학과',
        majorType: 'DOUBLE',
        conditions: [
          {
            code: 'MAJOR_BASIC',
            name: '전공 기초',
            current: 3,
            required: 9,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'MAJOR_REQUIRED',
            name: '전공 필수',
            current: 6,
            required: 15,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'MAJOR_ELECTIVE',
            name: '전공 선택',
            current: 6,
            required: 12,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'ENGLISH_COURSE',
            name: '영어 강의',
            current: 0,
            required: 3,
            unit: 'COURSES',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'SW_CERT_COURSE',
            name: 'SW 인증 강의',
            current: 0,
            required: null,
            unit: 'CREDITS',
            satisfied: true,
            chartTarget: true,
          },
        ],
        graduationRequired: null,
      },
      {
        majorName: '화학공학과',
        majorType: 'DOUBLE',
        conditions: [
          {
            code: 'MAJOR_BASIC',
            name: '전공 기초',
            current: 0,
            required: 9,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'MAJOR_REQUIRED',
            name: '전공 필수',
            current: 0,
            required: 15,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'MAJOR_ELECTIVE',
            name: '전공 선택',
            current: 0,
            required: 12,
            unit: 'CREDITS',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'ENGLISH_COURSE',
            name: '영어 강의',
            current: 0,
            required: 3,
            unit: 'COURSES',
            satisfied: false,
            chartTarget: true,
          },
          {
            code: 'SW_CERT_COURSE',
            name: 'SW 인증 강의',
            current: 0,
            required: null,
            unit: 'CREDITS',
            satisfied: true,
            chartTarget: true,
          },
        ],
        graduationRequired: null,
      },
    ],
    ge: {
      majorName: null,
      majorType: null,
      conditions: [
        {
          code: 'REQUIRED_GE',
          name: '필수 교과',
          current: 12,
          required: 17,
          unit: 'CREDITS',
          satisfied: false,
          chartTarget: true,
        },
        {
          code: 'DISTRIBUTED_GE',
          name: '배분 이수 교과',
          current: 3,
          required: 9,
          unit: 'CREDITS',
          satisfied: false,
          chartTarget: true,
        },
        {
          code: 'FREE_GE',
          name: '자유 이수 교과',
          current: 5,
          required: 3,
          unit: 'CREDITS',
          satisfied: true,
          chartTarget: true,
        },
        {
          code: 'ENGLISH_COURSE',
          name: '영어 강의',
          current: 0,
          required: 3,
          unit: 'COURSES',
          satisfied: false,
          chartTarget: true,
        },
        {
          code: 'SW_CERT_COURSE',
          name: 'SW 인증 강의',
          current: 3,
          required: 6,
          unit: 'CREDITS',
          satisfied: false,
          chartTarget: true,
        },
      ],
      graduationRequired: null,
    },
    others: {
      majorName: null,
      majorType: null,
      conditions: [
        {
          code: 'GENERAL_ELECTIVE',
          name: '기타',
          current: 12,
          required: null,
          unit: 'CREDITS',
          satisfied: false,
          chartTarget: false,
        },
      ],
      graduationRequired: null,
    },
  },
  certs: [
    { certType: 'THESIS', result: 'FAIL' },
    { certType: 'ENGLISH', result: 'PASS' },
    { certType: 'SW', result: 'PASS' },
    { certType: 'TOPIK', result: 'NONE' },
    { certType: 'GRADUATION_CERT', result: 'FAIL' },
  ],
};

// 체대생이 아닌 경우(졸업 필수 탭 없음) 확인용 mock
export const NON_PE_MOCK_DATA: GraduationResponse = {
  ...MOCK_DATA,
  sections: {
    majors: [NON_PE_MAIN_MAJOR, ...MOCK_DATA.sections!.majors.slice(1)],
    ge: MOCK_DATA.sections!.ge,
    others: MOCK_DATA.sections!.others,
  },
};

export const useGraduationStatusStore = create<GraduationStatusState>((set) => ({
  data: MOCK_DATA,
  setData: (data) => set({ data }),
}));
