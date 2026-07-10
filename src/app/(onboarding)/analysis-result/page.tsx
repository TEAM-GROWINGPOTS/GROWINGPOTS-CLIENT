'use client';

import { CourseInfo, CourseInfoTable, GraduationResult, RequirementCardProps, StudentInfo } from '@features/onboarding';
import { Button } from '@shared/components/button/button';
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

const requirementItems: RequirementCardProps[] = [
  { label: '총 학점', value: '88', total: '/120학점' },
  { label: '졸업 평점', value: '4.08', total: '/최소 1.7' },
  { label: '영어', value: '4', total: '/3과목' },
  { label: 'SW인증', value: '6', total: '/6학점', variant: 'dark' },
  { label: '전공 기초', value: '27', total: '/42학점', variant: 'dark' },
  { label: '전공 필수', value: '27', total: '/42학점', variant: 'dark' },
  { label: '전공 선택', value: '27', total: '/42학점', variant: 'dark' },
  { label: '배분이수교과', value: '27', total: '/42학점' },
  { label: '필수교과', value: '27', total: '/42학점' },
  { label: '자유이수', value: '27', total: '/42학점' },
  { label: '졸업능력인증', value: '통과', variant: 'highlight' },
  { label: '논문', value: '미통과' },
  { label: '한국어능력인증', value: '해당 없음', disabled: true },
];

export default function AnalysisResultPage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggleClick = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="w-full px-120 pt-80 pb-40">
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
          <Button label="PDF 재업로드" mode="primary_outline" size="lg" className="w-full justify-center" />
          <Button label="확인" mode="primary_solid" size="lg" className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
}
