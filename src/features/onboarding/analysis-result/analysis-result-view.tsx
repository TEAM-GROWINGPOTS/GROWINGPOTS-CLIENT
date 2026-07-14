'use client';

import { Button } from '@shared/components/button/button';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import { useOnboardingOptions } from '../hooks/use-onboarding-options';
import { useStudentCourses } from '../hooks/use-student-courses';
import { useStudentProfile } from '../hooks/use-student-profile';
import { useUpdateStudentCourses } from '../hooks/use-update-student-courses';
import { MOCK_GRADUATION_RESPONSE } from '../mocks/analysis-result';
import { CourseInfoTable, type CourseInfoTableRef } from './course-info-table/course-info-table';
import {
  mapCourseInfoToPutStudentCourses,
  mapStudentCoursesToCourseInfo,
} from './course-info-table/map-student-courses';
import { GraduationResult } from './graduation-result/graduation-result';
import { mapGraduationResponseToCards } from './graduation-result/map-graduation-response';
import { StudentInfo } from './student-info/student-info';

const requirementItems = mapGraduationResponseToCards(MOCK_GRADUATION_RESPONSE);

export const AnalysisResultView = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isCourseInfoValid, setIsCourseInfoValid] = useState(true);
  const courseInfoTableRef = useRef<CourseInfoTableRef>(null);
  const { data: studentProfile } = useStudentProfile();
  const { data: studentCourses } = useStudentCourses();
  const { data: onboardingOptions } = useOnboardingOptions();
  const { mutate: updateStudentCourses, isPending: isSaving } = useUpdateStudentCourses();

  const handleEditToggleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const rows = courseInfoTableRef.current?.getCourses();
    if (!rows || !studentCourses) return;

    updateStudentCourses(
      {
        courses: mapCourseInfoToPutStudentCourses(rows, studentCourses.courses, onboardingOptions?.departments ?? []),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCourseInfoValidityChange = useCallback((isValid: boolean) => {
    setIsCourseInfoValid(isValid);
  }, []);

  const handlePdfReuploadClick = () => {
    router.push('/onboarding?step=pdf');
  };

  const handleConfirmClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-120 pt-80 pb-40">
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
          disabled={isEditing && (!isCourseInfoValid || isSaving)}
          onClick={handleEditToggleClick}
        />
      </div>

      <div className="flex h-231 w-full gap-20">
        <div className="flex-1">
          {studentProfile && (
            <StudentInfo
              name={studentProfile.name}
              enrollmentStatus={studentProfile.enrollmentStatus}
              schoolName={studentProfile.schoolName}
              departmentName={studentProfile.departmentName}
              studentNo={studentProfile.studentNo}
              gradeLevel={studentProfile.gradeLevel}
              semester={studentProfile.semester}
            />
          )}
        </div>
        <div className="flex-3">
          <GraduationResult items={requirementItems} />
        </div>
      </div>

      <div className="mt-20 w-full">
        {studentCourses && (
          <CourseInfoTable
            ref={courseInfoTableRef}
            courses={mapStudentCoursesToCourseInfo(studentCourses.courses)}
            departments={onboardingOptions?.departments ?? []}
            isEditing={isEditing}
            onValidityChange={handleCourseInfoValidityChange}
          />
        )}
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
};
