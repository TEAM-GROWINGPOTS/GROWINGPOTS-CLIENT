'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  AddCourseSidebar,
  type Course,
} from '@features/semester-planner/card-view/add-course-sidebar/add-course-sidebar';
import {
  CourseFilterModal,
  type CourseFilterTabKeyTypes,
  type CourseFilterValues,
  getFilterTabByLabel,
  getSelectedFilterLabels,
} from '@features/semester-planner/card-view/course-filter-modal/course-filter-modal';
import { DroppableTerm } from '@features/semester-planner/card-view/dnd/droppable-term';
import { LibraryCourse } from '@features/semester-planner/card-view/dnd/library-course';
import { TrashDropZone } from '@features/semester-planner/card-view/dnd/trash-drop-zone';
import { useCardViewDnd } from '@features/semester-planner/card-view/dnd/use-card-view-dnd';
import { GraduationStatusAccordion } from '@features/semester-planner/card-view/graduation-status/graduation-status-accordion';
import { AddSemesterModal } from '@features/semester-planner/card-view/modals/add-semester-modal';
import { SemesterCard } from '@features/semester-planner/card-view/semester-card/semester-card';
import { getFolderName, getSelectedCourses, usePlannerTerms } from '@features/semester-planner/hooks/use-planner-terms';
import { MOCK_COURSE_SEARCH_ITEMS } from '@features/semester-planner/mocks/planner';
import { toSidebarCourse } from '@features/semester-planner/utils/map-planner';
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

// TODO: API 연동 시 과목검색(GET /courses) 결과로 교체하고 필터 값을 쿼리 파라미터로 전달
const LIBRARY_COURSES = MOCK_COURSE_SEARCH_ITEMS.map(toSidebarCourse);

interface CardViewProps {
  sidebarSlot: HTMLDivElement | null;
}

export const CardView = ({ sidebarSlot }: CardViewProps) => {
  const {
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
  const { activeCourse, overTermId, isLibraryDrag, contextProps } = useCardViewDnd({
    plannedTerms,
    snapshot,
    restoreSnapshot,
    moveCourseToTerm,
    insertCourse,
    removeCourse,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<CourseFilterValues>();
  const [filterTab, setFilterTab] = useState<CourseFilterTabKeyTypes | null>(null);
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

        <GraduationStatusAccordion className="mt-20" />

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
              courses={LIBRARY_COURSES}
              selectedFilterLabels={getSelectedFilterLabels(appliedFilters)}
              onFilterClick={handleFilterClick}
              onClose={() => setIsSidebarOpen(false)}
              onDirectAdd={handleDirectAdd}
              renderCourse={(course: Course) => <LibraryCourse key={course.id} course={course} />}
            />
          </div>,
          sidebarSlot,
        )}

      <DragOverlay dropAnimation={isLibraryDrag ? null : undefined}>
        {activeCourse && (
          <ClassCard
            department={activeCourse.department}
            title={activeCourse.name}
            tags={activeCourse.tags}
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
