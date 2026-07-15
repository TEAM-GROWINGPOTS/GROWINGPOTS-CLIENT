'use client';

import { useCollapsibleHeight } from '@features/onboarding/hooks/use-collapsible-height';
import { useCourseRows } from '@features/onboarding/hooks/use-course-rows';
import type { Division } from '@features/onboarding/types/course';
import { getCourseInfoColumns } from '@features/onboarding/utils/get-course-info-columns';
import { isCourseRowInvalid } from '@features/onboarding/utils/is-course-row-invalid';
import { getCourses } from '@shared/apis/get-courses';
import { QUERY_KEY } from '@shared/apis/query-key';
import type { DepartmentResponse } from '@shared/apis/types/onboarding-options';
import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { AddCourseModal } from '@shared/components/modal/add-course-modal';
import { ConfirmModal } from '@shared/components/modal/confirm-modal';
import { useDebouncedValue } from '@shared/hooks/use-debounced-value';
import { cn } from '@shared/utils/cn';
import { getTakenSemesterOptions, parseTakenSemesterValue } from '@shared/utils/taken-semester-format';
import { useQuery } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { TableHeader } from './table-header/table-header';
import { TableRow } from './table-row/table-row';

export interface CourseInfo {
  id: string;
  courseId: number | null;
  courseName: string;
  department: string;
  departmentId: number | null;
  credit: string;
  takenYear: number | null;
  semester: string | null;
  area: string;
  areaId: number | null;
}

interface CourseInfoTableProps {
  courses: CourseInfo[];
  departments: DepartmentResponse[];
  divisions: Division[];
  admissionYear?: number;
  isEditing?: boolean;
  onValidityChange?: (isValid: boolean) => void;
  onDeleteRows?: (remainingCourses: CourseInfo[]) => void;
}

export interface CourseInfoTableRef {
  getCourses: () => CourseInfo[];
}

const COURSE_NAME_MATCH_SIZE = 50;
const NONE_OPTION_LABEL = '해당없음';

export const CourseInfoTable = forwardRef<CourseInfoTableRef, CourseInfoTableProps>(
  ({ courses, departments, divisions, admissionYear, isEditing = false, onValidityChange, onDeleteRows }, ref) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addCourseName, setAddCourseName] = useState('');
    const [addCourseCredit, setAddCourseCredit] = useState('');
    const [addCourseArea, setAddCourseArea] = useState('');
    const [addCourseSemester, setAddCourseSemester] = useState('');
    const [addCourseShowError, setAddCourseShowError] = useState(false);

    const {
      rows,
      selectedIds,
      isAllSelected,
      hasInvalidRow,
      openCellKey,
      setOpenCellKey,
      handleCellChange,
      handleDepartmentChange,
      handleAreaChange,
      handleSemesterChange,
      handleSelectAllClick,
      handleRowSelectClick,
      handleAddCourseSubmit,
      handleDeleteConfirm,
    } = useCourseRows({ courses, isEditing, departments, divisions, onValidityChange, onDeleteRows });

    const { wrapperRef, isCollapsed, canToggle, collapsedHeight, naturalHeight, expanded, handleToggleClick } =
      useCollapsibleHeight(isEditing, rows.length);

    useImperativeHandle(ref, () => ({ getCourses: () => rows }), [rows]);

    const departmentOptions = [
      ...departments.map(({ departmentId, name }) => ({ value: `${departmentId}`, label: name })).reverse(),
      { value: '', label: NONE_OPTION_LABEL },
    ];

    const areaOptions = [
      ...divisions.map(({ id, name }) => ({ value: `${id}`, label: name })).reverse(),
      { value: '', label: NONE_OPTION_LABEL },
    ];

    const semesterOptions = getTakenSemesterOptions(
      admissionYear,
      rows.flatMap(({ takenYear }) => (takenYear === null ? [] : [takenYear])),
    );

    const trimmedAddCourseName = addCourseName.trim();
    const debouncedAddCourseName = useDebouncedValue(trimmedAddCourseName);
    const { data: searchedCourses = [], isFetching: isSearchingCourses } = useQuery({
      queryKey: QUERY_KEY.COURSES.SEARCH({ keyword: debouncedAddCourseName, size: COURSE_NAME_MATCH_SIZE }),
      queryFn: () => getCourses({ keyword: debouncedAddCourseName, size: COURSE_NAME_MATCH_SIZE }),
      select: (data) => data.courses,
      enabled: debouncedAddCourseName !== '',
    });
    const matchedCourse = searchedCourses.find((course) => course.name === trimmedAddCourseName);
    const isAddCourseNameValid = matchedCourse !== undefined;
    const isCourseSearchSettled = debouncedAddCourseName === trimmedAddCourseName && !isSearchingCourses;
    const courseNameErrorMessage =
      addCourseShowError && trimmedAddCourseName !== '' && isCourseSearchSettled && !isAddCourseNameValid
        ? '* 일치하는 과목명이 없습니다. 다시 확인해 주세요.'
        : undefined;
    const canSubmitAddCourse =
      isAddCourseNameValid && addCourseCredit !== '' && addCourseArea !== '' && addCourseSemester !== '';

    const columns = getCourseInfoColumns(departmentOptions, areaOptions, semesterOptions);

    const resetAddCourseForm = () => {
      setAddCourseName('');
      setAddCourseCredit('');
      setAddCourseArea('');
      setAddCourseSemester('');
      setAddCourseShowError(false);
    };

    const handleAddModalOpenChange = (nextOpen: boolean) => {
      setIsAddModalOpen(nextOpen);
      if (!nextOpen) resetAddCourseForm();
    };

    const handleAddClick = () => {
      setIsAddModalOpen(true);
    };

    const handleAddCourseNameChange = (value: string) => {
      setAddCourseName(value);
      setAddCourseShowError(false);
    };

    const handleAddCourseNameBlur = () => {
      setAddCourseShowError(trimmedAddCourseName !== '');
    };

    const handleAddCourseConfirm = () => {
      const parsedSemester = parseTakenSemesterValue(addCourseSemester);
      if (!canSubmitAddCourse || !matchedCourse || !parsedSemester) return;

      handleAddCourseSubmit({
        courseId: matchedCourse.courseId,
        courseName: trimmedAddCourseName,
        credit: addCourseCredit.endsWith('.') ? addCourseCredit.slice(0, -1) : addCourseCredit,
        area: addCourseArea,
        takenYear: parsedSemester.takenYear,
        semester: parsedSemester.semester,
      });
      handleAddModalOpenChange(false);
    };

    const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmClick = () => {
      handleDeleteConfirm();
      setIsDeleteModalOpen(false);
    };

    return (
      <section className="flex flex-col gap-18">
        <div className="flex h-32 w-full items-center justify-between">
          <div className="flex items-center gap-8">
            <p className="text-body-sb-16 text-gray-600">과목정보</p>
            {hasInvalidRow && (
              <p className="text-body-r-14 text-red-20">
                * 확인이 필요한 정보가 있어요. 빨간색으로 표시된 항목을 수정해 주세요.
              </p>
            )}
          </div>
          {isEditing && (
            <div className="flex items-center gap-12">
              <Button label="과목추가" mode="secondary_outline" size="sm" onClick={handleAddClick} />
              <Button
                label="과목삭제"
                mode="primary_solid"
                size="sm"
                className="bg-gray-600 enabled:hover:bg-gray-700"
                disabled={selectedIds.size === 0}
                onClick={handleDeleteClick}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-19">
          <div
            ref={wrapperRef}
            className={cn('w-full transition-[max-height] duration-300 ease-in-out', isCollapsed && 'overflow-hidden')}
            style={{ maxHeight: isCollapsed ? collapsedHeight : (naturalHeight ?? 10000) }}
          >
            <table className="w-full table-fixed border-separate [border-spacing:0_4px]">
              <caption className="sr-only">과목 정보</caption>
              <colgroup>
                {isEditing && <col className="w-40" />}
                {columns.map(({ key }) => (
                  <col key={key} />
                ))}
              </colgroup>
              <TableHeader
                columns={columns}
                isEditing={isEditing}
                isAllSelected={isAllSelected}
                onSelectAllClick={handleSelectAllClick}
              />
              <tbody>
                {rows.map((course) => (
                  <TableRow
                    key={course.id}
                    course={course}
                    columns={columns}
                    isEditing={isEditing}
                    isInvalid={isCourseRowInvalid(course)}
                    isSelected={selectedIds.has(course.id)}
                    openCellKey={openCellKey}
                    onOpenCellKeyChange={setOpenCellKey}
                    onRowSelectClick={handleRowSelectClick}
                    onCellChange={handleCellChange}
                    onDepartmentChange={handleDepartmentChange}
                    onAreaChange={handleAreaChange}
                    onSemesterChange={handleSemesterChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {canToggle && (
            <Button
              icon={<Icon name="ic_chevron_down" size={16} className={expanded ? 'rotate-180' : undefined} />}
              label={expanded ? '접기' : '전체 과목 보기'}
              mode="secondary_outline"
              size="sm"
              onClick={handleToggleClick}
            />
          )}
        </div>
        <ConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          type="delete"
          title={`선택한 과목 ${selectedIds.size}개를 삭제할까요?`}
          description="삭제한 과목은 복구할 수 없어요."
          onConfirm={handleDeleteConfirmClick}
        />
        <AddCourseModal
          open={isAddModalOpen}
          onOpenChange={handleAddModalOpenChange}
          courseName={addCourseName}
          onCourseNameChange={handleAddCourseNameChange}
          onCourseNameBlur={handleAddCourseNameBlur}
          courseNameErrorMessage={courseNameErrorMessage}
          credit={addCourseCredit}
          onCreditChange={setAddCourseCredit}
          area={addCourseArea}
          onAreaChange={setAddCourseArea}
          semester={addCourseSemester}
          onSemesterChange={setAddCourseSemester}
          admissionYear={admissionYear}
          canSubmit={canSubmitAddCourse}
          onSubmit={handleAddCourseConfirm}
        />
      </section>
    );
  },
);

CourseInfoTable.displayName = 'CourseInfoTable';
