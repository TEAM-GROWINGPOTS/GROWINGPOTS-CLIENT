'use client';

import { Button } from '@shared/components/button/button';
import { ConfirmModal } from '@shared/components/modal/confirm-modal';
import { useDepartmentOptions } from '@shared/hooks/use-department-options';
import { useGraduationStatus } from '@shared/hooks/use-graduation-status';
import { useStudentProfile } from '@shared/hooks/use-student-profile';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useCompleteOnboarding } from '../hooks/use-complete-onboarding';
import { useStudentCourses } from '../hooks/use-student-courses';
import { useUpdateStudentCourses } from '../hooks/use-update-student-courses';
import { type CourseInfo, CourseInfoTable, type CourseInfoTableRef } from './course-info-table/course-info-table';
import {
  mapCourseInfoToPutStudentCourses,
  mapStudentCoursesToCourseInfo,
} from './course-info-table/map-student-courses';
import { GraduationResult } from './graduation-result/graduation-result';
import { mapGraduationResponseToCards } from './graduation-result/map-graduation-response';
import { StudentInfo } from './student-info/student-info';

interface AnalysisResultViewProps {
  isOnboardingCompleted?: boolean;
}

export const AnalysisResultView = ({ isOnboardingCompleted = false }: AnalysisResultViewProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isCourseInfoValid, setIsCourseInfoValid] = useState(true);
  const [isEditNoticeModalOpen, setIsEditNoticeModalOpen] = useState(false);
  const courseInfoTableRef = useRef<CourseInfoTableRef>(null);
  const { data: studentProfile } = useStudentProfile();
  const { data: studentCourses } = useStudentCourses();
  const { data: departments = [] } = useDepartmentOptions();
  const { data: graduation } = useGraduationStatus();
  const { mutate: updateStudentCourses, isPending: isSaving } = useUpdateStudentCourses();
  const { mutateAsync: completeOnboarding } = useCompleteOnboarding();
  const courses = useMemo(
    () => (studentCourses ? mapStudentCoursesToCourseInfo(studentCourses.courses) : []),
    [studentCourses],
  );
  const requirementItems = graduation ? mapGraduationResponseToCards(graduation) : [];

  const handleEditToggleClick = () => {
    if (!isEditing) {
      if (!isCourseInfoValid) {
        setIsEditNoticeModalOpen(true);
        return;
      }
      setIsEditing(true);
      return;
    }

    const rows = courseInfoTableRef.current?.getCourses();
    if (!rows || !studentCourses) return;

    updateStudentCourses(
      { courses: mapCourseInfoToPutStudentCourses(rows, studentCourses.courses) },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleEditNoticeConfirm = () => {
    setIsEditNoticeModalOpen(false);
    setIsEditing(true);
  };

  const handleCourseInfoValidityChange = useCallback((isValid: boolean) => {
    setIsCourseInfoValid(isValid);
  }, []);

  const handleDeleteRows = (remainingCourses: CourseInfo[]) => {
    if (!studentCourses) return;

    updateStudentCourses({ courses: mapCourseInfoToPutStudentCourses(remainingCourses, studentCourses.courses) });
  };

  const handlePdfReuploadClick = () => {
    router.push('/onboarding?step=pdf');
  };

  const handleConfirmClick = async () => {
    const rows = courseInfoTableRef.current?.getCourses();
    if (!rows || !studentCourses) {
      await completeOnboarding();
      router.push('/graduation-dashboard');
      return;
    }

    updateStudentCourses(
      { courses: mapCourseInfoToPutStudentCourses(rows, studentCourses.courses) },
      {
        onSuccess: async () => {
          await completeOnboarding();
          router.push('/graduation-dashboard');
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-120 pt-80 pb-40">
      <div className="mb-28 flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-title-sb-24 text-gray-900">
            {isOnboardingCompleted ? '졸업 현황 분석' : '분석 결과를 확인이 필요해요'}
          </h1>
          {!isOnboardingCompleted && (
            <p className="text-body-r-16 text-gray-500">
              PDF에서 추출한 정보를 바탕으로 졸업 현황을 분석했어요. 업로드한 내용이 맞는지 확인해 주세요!
            </p>
          )}
        </div>
        <div className="flex items-center gap-8">
          {isEditing && (
            <Button
              label="취소하기"
              mode="secondary_outline"
              size="sm"
              disabled={isSaving}
              onClick={handleCancelClick}
            />
          )}
          <Button
            label={isEditing ? '저장하기' : '편집하기'}
            mode={isEditing ? 'primary_solid' : 'secondary_outline'}
            size="sm"
            disabled={isEditing && (!isCourseInfoValid || isSaving)}
            onClick={handleEditToggleClick}
          />
        </div>
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

      <section className="mt-20 w-full rounded-lg bg-white px-24 py-20">
        {studentCourses && (
          <CourseInfoTable
            ref={courseInfoTableRef}
            courses={courses}
            departments={departments}
            divisions={studentCourses.availableDivisions}
            admissionYear={studentProfile?.admissionYear}
            isEditing={isEditing}
            onValidityChange={handleCourseInfoValidityChange}
            onDeleteRows={handleDeleteRows}
          />
        )}
      </section>

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
            disabled={isEditing || isSaving || !isCourseInfoValid}
            onClick={handleConfirmClick}
          />
        </div>
      </div>

      <ConfirmModal
        open={isEditNoticeModalOpen}
        onOpenChange={setIsEditNoticeModalOpen}
        type="notice"
        title="수정이 필요한 정보가 있어요"
        description="빨간색으로 표시된 항목을 확인 후 수정해 주세요."
        onConfirm={handleEditNoticeConfirm}
      />
    </div>
  );
};
