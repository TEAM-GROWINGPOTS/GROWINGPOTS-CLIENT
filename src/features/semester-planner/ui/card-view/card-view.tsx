'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useCourseSearch } from '@features/semester-planner/hooks/use-course-search';
import { useDebouncedValue } from '@features/semester-planner/hooks/use-debounced-value';
import { useGraduationStatus } from '@features/semester-planner/hooks/use-graduation-status';
import { getFolderName, getSelectedCourses, usePlannerTerms } from '@features/semester-planner/hooks/use-planner-terms';
import type { CourseSearchItemResponse } from '@features/semester-planner/types/course-search';
import { AddCourseSidebar } from '@features/semester-planner/ui/card-view/add-course-sidebar/add-course-sidebar';
import {
  CourseFilterModal,
  type CourseFilterTabKeyTypes,
  type CourseFilterValues,
  getFilterTabByLabel,
  getSelectedFilterLabels,
  INITIAL_COURSE_FILTER_VALUES,
} from '@features/semester-planner/ui/card-view/course-filter-modal/course-filter-modal';
import { DroppableTerm } from '@features/semester-planner/ui/card-view/dnd/droppable-term';
import { LibraryCourse } from '@features/semester-planner/ui/card-view/dnd/library-course';
import { TrashDropZone } from '@features/semester-planner/ui/card-view/dnd/trash-drop-zone';
import { useCardViewDnd } from '@features/semester-planner/ui/card-view/dnd/use-card-view-dnd';
import { GraduationStatusAccordion } from '@features/semester-planner/ui/card-view/graduation-status-accordion/graduation-status-accordion';
import { AddSemesterModal } from '@features/semester-planner/ui/card-view/modals/add-semester-modal';
import { SemesterCard } from '@features/semester-planner/ui/card-view/semester-card/semester-card';
import { toast, Toaster } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { ClassCard } from '@shared/components/class-card/class-card';
import Icon from '@shared/components/icon/icon';
import { IconButton } from '@shared/components/icon-button/icon-button';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';
import { type TransitionEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SEMESTER_CODE_MAP: Record<string, { sortValue: number; label: string }> = {
  '1': { sortValue: 1, label: '1학기' },
  '2': { sortValue: 1.5, label: '여름학기' },
  '3': { sortValue: 2, label: '2학기' },
  '4': { sortValue: 2.5, label: '겨울학기' },
};

interface CardViewProps {
  sidebarSlot: HTMLDivElement | null;
}

export const CardView = ({ sidebarSlot }: CardViewProps) => {
  const {
    isLoading: isPlannerLoading,
    plannedTerms,
    gridTerms,
    snapshot,
    restoreSnapshot,
    moveCourseToTerm,
    insertCourse,
    removeCourse,
    addTerm,
    removeTerm,
    addFolder,
    selectFolder,
    renameFolder,
    deleteFolder,
  } = usePlannerTerms();
  const { activeCourse, overTermId, isLibraryDrag, isDropRejected, contextProps } = useCardViewDnd({
    plannedTerms,
    snapshot,
    restoreSnapshot,
    moveCourseToTerm,
    insertCourse,
    removeCourse,
  });
  const { data: graduationData } = useGraduationStatus('PLANNED');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<CourseFilterValues>();
  const [filterTab, setFilterTab] = useState<CourseFilterTabKeyTypes | null>(null);
  const debouncedKeyword = useDebouncedValue(searchKeyword.trim());
  const { extras: _extras, ...appliedSearchParams } = appliedFilters ?? INITIAL_COURSE_FILTER_VALUES;
  const {
    data: libraryCourses = [],
    isLoading: isCoursesLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCourseSearch({ keyword: debouncedKeyword || undefined, ...appliedSearchParams }, { enabled: isSidebarOpen });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const closeSideNavigation = useSideNavigationStore((state) => state.closeSidebar);
  const boardRef = useRef<HTMLElement>(null);

  const updateScrollability = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    setCanScrollLeft(board.scrollLeft > 1);
    setCanScrollRight(board.scrollWidth - board.clientWidth - board.scrollLeft > 1);
  }, []);

  useEffect(() => {
    updateScrollability();
    window.addEventListener('resize', updateScrollability);
    return () => window.removeEventListener('resize', updateScrollability);
  }, [gridTerms, updateScrollability]);

  const handleSidebarTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'width') return;
    updateScrollability();
    if (!isSidebarOpen) return;
    const board = boardRef.current;
    board?.scrollTo({ left: board.scrollWidth, behavior: 'smooth' });
  };

  const handleScrollLeftClick = () => {
    boardRef.current?.scrollBy({ left: -282, behavior: 'smooth' });
  };

  const handleScrollRightClick = () => {
    boardRef.current?.scrollBy({ left: 282, behavior: 'smooth' });
  };

  const handleFilterClick = (label: string) => {
    const tab = getFilterTabByLabel(label);
    if (tab) setFilterTab(tab);
  };

  const handleLoadMoreCourses = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleDirectAdd = () => {
    console.log('직접추가 클릭 — 과목 직접추가 모달 연결 예정');
  };

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
    closeSideNavigation();
  };

  const handleAddFolder = (termId: string) => {
    const term = addFolder(termId);
    if (!term) return;
    toast.success(`${term.yearLevel}학년 ${term.semesterLabel} 폴더가 생성되었어요.`);
  };

  const handleAddSemester = (year: string, semester: string) => {
    const semesterInfo = SEMESTER_CODE_MAP[semester];
    if (!semesterInfo) return;
    const yearLevel = Number.parseInt(year, 10);

    const added = addTerm({ yearLevel, semester: semesterInfo.sortValue, semesterLabel: semesterInfo.label });
    if (!added) {
      toast.negative('이미 추가된 학기예요.');
      return;
    }
    setIsAddSemesterOpen(false);
  };

  if (isPlannerLoading) return null;

  return (
    <DndContext id="card-view-dnd" {...contextProps}>
      <div className="flex h-full min-w-0 flex-col px-40 pt-16 pb-40">
        <header className="flex items-center justify-between">
          <h1 className="text-title-sb-24 text-gray-900">학기 플래너</h1>
          <Button
            label="과목추가"
            mode="primary_solid"
            icon={<Icon name="ic_plus" size={16} />}
            onClick={handleOpenSidebar}
          />
        </header>

        <GraduationStatusAccordion className="mt-20" data={graduationData} />

        <div className="relative mt-24 min-h-0 flex-1">
          <section
            ref={boardRef}
            onScroll={updateScrollability}
            className="flex h-full items-start gap-24 overflow-x-auto pb-20"
          >
            {gridTerms.map((term) =>
              term.status === 'planned' ? (
                <DroppableTerm
                  key={term.id}
                  term={term}
                  isDropTarget={overTermId === term.id}
                  onDeleteTerm={() => removeTerm(term.id)}
                  onAddFolder={() => handleAddFolder(term.id)}
                  onSelectFolder={(folderId) => selectFolder(term.id, folderId)}
                  onRenameFolder={(folderId, name) => renameFolder(term.id, folderId, name)}
                  onDeleteFolder={(folderId) => deleteFolder(term.id, folderId)}
                />
              ) : (
                <SemesterCard
                  key={term.id}
                  className="max-h-full"
                  yearLevel={term.yearLevel}
                  semester={term.semester}
                  semesterLabel={term.semesterLabel}
                  status={term.status}
                  folderName={getFolderName(term)}
                  courses={getSelectedCourses(term)}
                />
              ),
            )}
            <IconButton
              icon="ic_plus"
              aria-label="학기 추가"
              size="medium"
              className="shrink-0 self-center"
              onClick={() => setIsAddSemesterOpen(true)}
            />
          </section>
          {canScrollLeft && (
            <IconButton
              icon="ic_chevron_left"
              aria-label="이전 학기 보기"
              size="medium"
              className="absolute top-1/2 left-0 -translate-y-1/2"
              onClick={handleScrollLeftClick}
            />
          )}
          {canScrollRight && (
            <IconButton
              icon="ic_chevron_right"
              aria-label="다음 학기 보기"
              size="medium"
              className="absolute top-1/2 right-0 -translate-y-1/2"
              onClick={handleScrollRightClick}
            />
          )}
          {activeCourse && !isLibraryDrag && <TrashDropZone />}
        </div>
      </div>

      {sidebarSlot &&
        createPortal(
          <div
            onTransitionEnd={handleSidebarTransitionEnd}
            className={cn(
              'h-full overflow-hidden transition-[width] duration-300 ease-out',
              isSidebarOpen ? 'w-300' : 'w-0',
            )}
          >
            <AddCourseSidebar
              courses={libraryCourses}
              keyword={searchKeyword}
              onKeywordChange={setSearchKeyword}
              isLoading={isCoursesLoading}
              onLoadMore={handleLoadMoreCourses}
              selectedFilterLabels={getSelectedFilterLabels(appliedFilters)}
              onFilterClick={handleFilterClick}
              onClose={() => setIsSidebarOpen(false)}
              onDirectAdd={handleDirectAdd}
              renderCourse={(course: CourseSearchItemResponse) => (
                <LibraryCourse key={course.courseId} course={course} />
              )}
            />
          </div>,
          sidebarSlot,
        )}

      <DragOverlay dropAnimation={isLibraryDrag && !isDropRejected ? null : undefined}>
        {activeCourse && (
          <ClassCard
            department={activeCourse.departmentName}
            title={activeCourse.name}
            tags={activeCourse.tags}
            isEnglish={activeCourse.isEnglish}
            isSw={activeCourse.isSw}
            className="shadow-small w-242 border border-gray-100"
          />
        )}
      </DragOverlay>

      <AddSemesterModal open={isAddSemesterOpen} onOpenChange={setIsAddSemesterOpen} onSubmit={handleAddSemester} />
      <CourseFilterModal
        open={filterTab !== null}
        onOpenChange={(open) => {
          if (!open) setFilterTab(null);
        }}
        initialTab={filterTab ?? undefined}
        initialValues={appliedFilters}
        onApply={setAppliedFilters}
      />
      <Toaster />
    </DndContext>
  );
};
