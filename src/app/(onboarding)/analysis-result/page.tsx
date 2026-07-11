'use client';

import {
  CourseInfo,
  CourseInfoTable,
  GraduationResult,
  mapGraduationResponseToCards,
  StudentInfo,
} from '@features/onboarding';
import type { GraduationResponse } from '@shared/apis/types/graduation';
import { Button } from '@shared/components/button/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const courses: CourseInfo[] = [
  { id: '1', courseName: '세계와시민', department: '해당없음', credit: '3', semester: '1학기', area: '필수교과' },
  {
    id: '2',
    courseName: '인간의가치탐색',
    department: '해당없음',
    credit: '3',
    semester: '2학기',
    area: '필수교과',
  },
  {
    id: '3',
    courseName: '빅뱅에서문명까지',
    department: '해당없음',
    credit: '3',
    semester: '2학기',
    area: '필수교과',
  },
  {
    id: '4',
    courseName: '고전으로읽는리더십',
    department: '해당없음',
    credit: '3',
    semester: '1학기',
    area: '필수교과',
  },
  { id: '5', courseName: '한국사의이해', department: '해당없음', credit: '3', semester: '2학기', area: '필수교과' },
  {
    id: '6',
    courseName: '영화의이해',
    department: '연극영화학과',
    credit: '3',
    semester: '3학기',
    area: '전공 기초',
  },
  {
    id: '7',
    courseName: '연기실습기초',
    department: '연극영화학과',
    credit: '3',
    semester: '3학기',
    area: '전공 필수',
  },
  {
    id: '8',
    courseName: '시나리오작법',
    department: '연극영화학과',
    credit: '3',
    semester: '4학기',
    area: '전공 필수',
  },
  {
    id: '9',
    courseName: '영화편집실습',
    department: '연극영화학과',
    credit: '3',
    semester: '4학기',
    area: '전공 선택',
  },
  {
    id: '10',
    courseName: '다큐멘터리제작',
    department: '연극영화학과',
    credit: '3',
    semester: '5학기',
    area: '전공 선택',
  },
];

const graduationResponse: GraduationResponse = {
  summary: {
    totalCredits: { current: 87, required: 130 },
    gpa: { current: 3.85, min: 2 },
    enrollmentStatus: '재학',
  },
  graduatable: false,
  conditions: null,
  graduationRequired: null,
  sections: {
    majors: [
      {
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
            current: 7,
            required: 3,
            unit: 'COURSES',
            satisfied: true,
            chartTarget: false,
          },
          {
            code: 'SW_CERT_COURSE',
            name: 'SW 인증 강의',
            current: 6,
            required: 6,
            unit: 'CREDITS',
            satisfied: true,
            chartTarget: false,
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
      },
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
            chartTarget: false,
          },
          {
            code: 'SW_CERT_COURSE',
            name: 'SW 인증 강의',
            current: 0,
            required: 0,
            unit: 'CREDITS',
            satisfied: true,
            chartTarget: false,
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
            chartTarget: false,
          },
          {
            code: 'SW_CERT_COURSE',
            name: 'SW 인증 강의',
            current: 0,
            required: 0,
            unit: 'CREDITS',
            satisfied: true,
            chartTarget: false,
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
          current: 7,
          required: 3,
          unit: 'COURSES',
          satisfied: true,
          chartTarget: false,
        },
        {
          code: 'SW_CERT_COURSE',
          name: 'SW 인증 강의',
          current: 6,
          required: 6,
          unit: 'CREDITS',
          satisfied: true,
          chartTarget: false,
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
          current: 21,
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
    { certType: 'ENGLISH', result: 'PASS' },
    { certType: 'SW', result: 'FAIL' },
    { certType: 'TOPIK', result: 'NONE' },
    { certType: 'THESIS', result: 'NONE' },
  ],
};

const requirementItems = mapGraduationResponseToCards(graduationResponse);

export default function AnalysisResultPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggleClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handlePdfReuploadClick = () => {
    router.push('/onboarding?step=pdf');
  };

  const handleConfirmClick = () => {
    router.push('/');
  };

  return (
    <div className="w-full bg-gray-50 px-120 pt-80 pb-40">
      <div className="mb-28 flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-title-sb-24 text-gray-900">분석 결과를 확인해 주세요</h1>
          <p className="text-body-r-16 text-gray-500">
            PDF에서 추출한 정보를 바탕으로 졸업 현황을 분석했습니다. 잘못된 정보가 있다면 수정해주세요!
          </p>
        </div>
        <Button
          label={isEditing ? '저장하기' : '편집하기'}
          mode={isEditing ? 'primary_solid' : 'secondary_outline'}
          size="sm"
          onClick={handleEditToggleClick}
        />
      </div>

      <div className="flex h-231 w-full gap-20">
        <div className="flex-1">
          <StudentInfo
            name="김경민"
            enrollmentStatus="재학 중"
            schoolName="경희대학교(국제캠퍼스)"
            departmentName="연극영화학과 영화트랙"
            studentNo="2023103101"
            gradeLevel={4}
            semester={1}
          />
        </div>
        <div className="flex-4">
          <GraduationResult items={requirementItems} />
        </div>
      </div>

      <div className="mt-20 w-full">
        <CourseInfoTable courses={courses} isEditing={isEditing} />
      </div>

      <div className="mt-20 flex justify-center">
        <div className="flex w-416 flex-col gap-8">
          <Button
            label="PDF 재업로드"
            mode="primary_outline"
            size="lg"
            className="w-full justify-center"
            disabled={isEditing}
            onClick={handlePdfReuploadClick}
          />
          <Button
            label="확인"
            mode="primary_solid"
            size="lg"
            className="w-full justify-center"
            disabled={isEditing}
            onClick={handleConfirmClick}
          />
        </div>
      </div>
    </div>
  );
}
