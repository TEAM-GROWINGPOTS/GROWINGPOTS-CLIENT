'use client';

import { AddCourseSidebar } from '@features/semester-planner/ui/card-view/add-course-sidebar/add-course-sidebar';
import {
  CourseFilterModal,
  type CourseFilterTabKeyTypes,
  type CourseFilterValues,
  getFilterTabByLabel,
  getSelectedFilterLabels,
  INITIAL_COURSE_FILTER_VALUES,
} from '@features/semester-planner/ui/card-view/course-filter-modal/course-filter-modal';
import { LibraryCourse } from '@features/semester-planner/ui/card-view/dnd/library-course';
import { parseApiError } from '@shared/apis/parse-api-error';
import type { CourseSearchItemResponse } from '@shared/apis/types/course-search';
import { toast } from '@shared/components';
import { AddCourseModal } from '@shared/components/modal/add-course-modal';
import { useCourseSearch } from '@shared/hooks/use-course-search';
import { useDebouncedValue } from '@shared/hooks/use-debounced-value';
import { useCallback, useEffect, useState } from 'react';

interface AddCourseSidebarContainerProps {
  isOpen: boolean;
  onClose: () => void;
  admissionYear?: number;
}

// 검색·필터·직접추가 state를 사이드바 안에 두어, 입력할 때마다 학기 보드까지 다시 렌더되지 않게 한다.
export const AddCourseSidebarContainer = ({ isOpen, onClose, admissionYear }: AddCourseSidebarContainerProps) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<CourseFilterValues>();
  const [filterTab, setFilterTab] = useState<CourseFilterTabKeyTypes | null>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [addCourseName, setAddCourseName] = useState('');
  const [addCourseCredit, setAddCourseCredit] = useState('');
  const [addCourseArea, setAddCourseArea] = useState('');
  const [addCourseSemester, setAddCourseSemester] = useState('');
  const debouncedKeyword = useDebouncedValue(searchKeyword.trim());
  const {
    data: libraryCourses = [],
    isLoading: isCoursesLoading,
    isError: isCourseSearchError,
    error: courseSearchError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCourseSearch(
    { keyword: debouncedKeyword || undefined, ...(appliedFilters ?? INITIAL_COURSE_FILTER_VALUES) },
    { enabled: isOpen },
  );
  const canSubmitAddCourse =
    addCourseName.trim() !== '' && addCourseCredit !== '' && addCourseArea !== '' && addCourseSemester !== '';

  useEffect(() => {
    if (!isCourseSearchError) return;
    parseApiError(courseSearchError).then((parsed) => toast.negative(parsed?.message ?? '과목 검색에 실패했어요.'));
  }, [isCourseSearchError, courseSearchError]);

  const renderCourse = useCallback(
    (course: CourseSearchItemResponse) => (
      <LibraryCourse key={course.courseId} course={course} admissionYear={admissionYear} />
    ),
    [admissionYear],
  );

  const handleFilterClick = (label: string) => {
    const tab = getFilterTabByLabel(label);
    if (tab) setFilterTab(tab);
  };

  const handleLoadMoreCourses = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const resetAddCourseForm = () => {
    setAddCourseName('');
    setAddCourseCredit('');
    setAddCourseArea('');
    setAddCourseSemester('');
  };

  const handleAddCourseModalOpenChange = (nextOpen: boolean) => {
    setIsAddCourseModalOpen(nextOpen);
    if (!nextOpen) resetAddCourseForm();
  };

  const handleAddCourseSubmit = () => {
    if (!canSubmitAddCourse) return;
    handleAddCourseModalOpenChange(false);
  };

  return (
    <>
      <AddCourseSidebar
        courses={libraryCourses}
        keyword={searchKeyword}
        onKeywordChange={setSearchKeyword}
        isLoading={isCoursesLoading}
        onLoadMore={handleLoadMoreCourses}
        selectedFilterLabels={getSelectedFilterLabels(appliedFilters)}
        onFilterClick={handleFilterClick}
        onClose={onClose}
        onDirectAdd={() => setIsAddCourseModalOpen(true)}
        admissionYear={admissionYear}
        renderCourse={renderCourse}
      />
      <CourseFilterModal
        open={filterTab !== null}
        onOpenChange={(open) => {
          if (!open) setFilterTab(null);
        }}
        initialTab={filterTab ?? undefined}
        initialValues={appliedFilters}
        onApply={setAppliedFilters}
      />
      <AddCourseModal
        open={isAddCourseModalOpen}
        onOpenChange={handleAddCourseModalOpenChange}
        courseName={addCourseName}
        onCourseNameChange={setAddCourseName}
        credit={addCourseCredit}
        onCreditChange={setAddCourseCredit}
        area={addCourseArea}
        onAreaChange={setAddCourseArea}
        semester={addCourseSemester}
        onSemesterChange={setAddCourseSemester}
        canSubmit={canSubmitAddCourse}
        onSubmit={handleAddCourseSubmit}
      />
    </>
  );
};
