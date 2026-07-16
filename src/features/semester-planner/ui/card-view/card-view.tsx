'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { getSemesterLabelByCode } from '@features/semester-planner/constants';
import {
  getFolderName,
  getSelectedCourses,
  getSelectedTotalCredit,
  usePlannerTerms,
} from '@features/semester-planner/hooks/use-planner-terms';
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
import { useBoardEdgeScroll } from '@features/semester-planner/ui/card-view/dnd/use-board-edge-scroll';
import { useCardViewDnd } from '@features/semester-planner/ui/card-view/dnd/use-card-view-dnd';
import { GraduationStatusAccordion } from '@features/semester-planner/ui/card-view/graduation-status-accordion/graduation-status-accordion';
import { AddSemesterModal } from '@features/semester-planner/ui/card-view/modals/add-semester-modal';
import { PrerequisiteModal } from '@features/semester-planner/ui/card-view/modals/prerequisite-modal';
import { SemesterCard } from '@features/semester-planner/ui/card-view/semester-card/semester-card';
import { clearPendingFocusTerm, peekPendingFocusTerm } from '@features/semester-planner/utils/pending-focus-term';
import { parseApiError } from '@shared/apis/parse-api-error';
import { CourseSearchItemResponse } from '@shared/apis/types/course-search';
import { toast, Toaster } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { ClassCard } from '@shared/components/class-card/class-card';
import Icon from '@shared/components/icon/icon';
import { IconButton } from '@shared/components/icon-button/icon-button';
import { AddCourseModal } from '@shared/components/modal/add-course-modal';
import { useCourseSearch } from '@shared/hooks/use-course-search';
import { useDebouncedValue } from '@shared/hooks/use-debounced-value';
import { useGraduationStatus } from '@shared/hooks/use-graduation-status';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';
import { useRouter } from 'next/navigation';
import { type TransitionEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const CARD_WIDTH = 258;
const CARD_SCROLL_STEP = 282; // 학기 카드 너비 258 + gap 24
const CARD_GAP_CENTER_OFFSET = 12; // 카드 앞 gap 24의 중앙에 오도록 남기는 여백
const CARD_BOUNDARY_TOLERANCE = 2;

interface CardViewProps {
  sidebarSlot: HTMLDivElement | null;
}

export const CardView = ({ sidebarSlot }: CardViewProps) => {
  const {
    isLoading: isPlannerLoading,
    isError: isPlannerError,
    error: plannerError,
    plannedTerms,
    gridTerms,
    snapshot,
    restoreSnapshot,
    previewCourseMove,
    dropCourseToTerm,
    insertCourse,
    removeCourse,
    addTerm,
    removeTerm,
    addFolder,
    selectFolder,
    renameFolder,
    deleteFolder,
  } = usePlannerTerms();
  const { data: graduationData, isError: isGraduationError, error: graduationError } = useGraduationStatus('PLANNED');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [addCourseName, setAddCourseName] = useState('');
  const [addCourseCredit, setAddCourseCredit] = useState('');
  const [addCourseArea, setAddCourseArea] = useState('');
  const [addCourseSemester, setAddCourseSemester] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<CourseFilterValues>();
  const [filterTab, setFilterTab] = useState<CourseFilterTabKeyTypes | null>(null);
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
    { enabled: isSidebarOpen },
  );
  const canSubmitAddCourse =
    addCourseName.trim() !== '' && addCourseCredit !== '' && addCourseArea !== '' && addCourseSemester !== '';
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [lastCardElement, setLastCardElement] = useState<HTMLElement | null>(null);
  const [addSemesterButtonTop, setAddSemesterButtonTop] = useState<number | null>(null);
  const closeSideNavigation = useSideNavigationStore((state) => state.closeSidebar);
  const boardRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const edgeScroll = useBoardEdgeScroll(boardRef, scrollWrapperRef);
  const pendingScrollTermRef = useRef<{ yearLevel: number; semesterLabel: string } | null>(null);
  const [scrollToCourse, setScrollToCourse] = useState<{ termId: string; courseId: string; key: number } | null>(null);
  const router = useRouter();

  const handleCourseInserted = useCallback((termId: string, courseId: string) => {
    setScrollToCourse({ termId, courseId, key: Date.now() });
  }, []);

  const {
    activeCourse,
    overTermId,
    isLibraryDrag,
    isDropRejected,
    prerequisiteModal,
    setPrerequisiteModal,
    contextProps,
  } = useCardViewDnd({
    plannedTerms,
    snapshot,
    restoreSnapshot,
    previewCourseMove,
    dropCourseToTerm,
    insertCourse,
    removeCourse,
    onCourseInserted: handleCourseInserted,
  });

  useEffect(() => {
    if (!isPlannerError) return;
    parseApiError(plannerError).then((parsed) => {
      if (parsed?.status === 404) {
        router.replace('/onboarding');
        return;
      }
      toast.negative(parsed?.message ?? '플래너를 불러오지 못했어요.');
    });
  }, [isPlannerError, plannerError, router]);

  useEffect(() => {
    if (!isGraduationError) return;
    parseApiError(graduationError).then((parsed) =>
      toast.negative(parsed?.message ?? '졸업 요건 현황을 불러오지 못했어요.'),
    );
  }, [isGraduationError, graduationError]);

  useEffect(() => {
    if (!isCourseSearchError) return;
    parseApiError(courseSearchError).then((parsed) => toast.negative(parsed?.message ?? '과목 검색에 실패했어요.'));
  }, [isCourseSearchError, courseSearchError]);

  const handleLastCardRef = useCallback((node: HTMLElement | null) => {
    setLastCardElement(node);
    setAddSemesterButtonTop(node ? node.offsetHeight / 2 : null);
  }, []);

  useEffect(() => {
    if (!lastCardElement) return;
    const observer = new ResizeObserver(() => setAddSemesterButtonTop(lastCardElement.offsetHeight / 2));
    observer.observe(lastCardElement);
    return () => observer.disconnect();
  }, [lastCardElement]);

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

  useEffect(() => {
    const pendingTerm = pendingScrollTermRef.current || peekPendingFocusTerm();
    if (!pendingTerm) return;
    const termIndex = gridTerms.findIndex(
      ({ status, yearLevel, semesterLabel }) =>
        status === 'planned' && yearLevel === pendingTerm.yearLevel && semesterLabel === pendingTerm.semesterLabel,
    );
    if (termIndex === -1) return;
    const board = boardRef.current;
    if (!board) return;

    if (pendingScrollTermRef.current) {
      pendingScrollTermRef.current = null;
    } else {
      clearPendingFocusTerm();
    }

    const cardCenter = termIndex * CARD_SCROLL_STEP + CARD_WIDTH / 2;
    board.scrollTo({
      left: Math.max(cardCenter - board.clientWidth / 2, 0),
      behavior: 'smooth',
    });
  }, [gridTerms]);

  const handleSidebarTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'width') return;
    updateScrollability();
    if (!isSidebarOpen) return;
    const board = boardRef.current;
    board?.scrollTo({ left: board.scrollWidth, behavior: 'smooth' });
  };

  const handleScrollLeftClick = () => {
    const board = boardRef.current;
    if (!board) return;
    const prevCardIndex =
      Math.ceil((board.scrollLeft + CARD_GAP_CENTER_OFFSET - CARD_BOUNDARY_TOLERANCE) / CARD_SCROLL_STEP) - 1;
    board.scrollTo({
      left: Math.max(prevCardIndex * CARD_SCROLL_STEP - CARD_GAP_CENTER_OFFSET, 0),
      behavior: 'smooth',
    });
  };

  const handleScrollRightClick = () => {
    const board = boardRef.current;
    if (!board) return;
    const nextCardIndex =
      Math.floor((board.scrollLeft + CARD_GAP_CENTER_OFFSET + CARD_BOUNDARY_TOLERANCE) / CARD_SCROLL_STEP) + 1;
    board.scrollTo({
      left: nextCardIndex * CARD_SCROLL_STEP - CARD_GAP_CENTER_OFFSET,
      behavior: 'smooth',
    });
  };

  const handleFilterClick = (label: string) => {
    const tab = getFilterTabByLabel(label);
    if (tab) setFilterTab(tab);
  };

  const handleLoadMoreCourses = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleDirectAdd = () => {
    setIsAddCourseModalOpen(true);
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

  const handleToggleSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      return;
    }
    setIsSidebarOpen(true);
    closeSideNavigation();
  };

  const handleAddFolder = (termId: string) => {
    const folder = addFolder(termId);
    if (!folder) return;
    toast.success(`'${folder.name}' 폴더가 생성되었어요.`);
  };

  const handleAddSemester = (year: string, semester: string) => {
    const semesterLabel = getSemesterLabelByCode(semester);
    if (!semesterLabel) return;
    const yearLevel = Number.parseInt(year, 10);

    const result = addTerm({ yearLevel, semester: Number(semester), semesterLabel });
    if (result === 'duplicate') {
      toast.negative('이미 추가된 학기예요.');
      return;
    }
    if (result === 'past') {
      toast.negative('지난 학기는 추가할 수 없어요.');
      return;
    }
    pendingScrollTermRef.current = { yearLevel, semesterLabel };
    setIsAddSemesterOpen(false);
    toast.success(`${yearLevel}학년 ${semesterLabel}가 추가되었어요.`);
  };

  if (isPlannerLoading) return null;

  if (isPlannerError) return null;

  return (
    <DndContext
      id="card-view-dnd"
      {...contextProps}
      autoScroll={false}
      onDragStart={(event) => {
        edgeScroll.handleDragStart(event);
        contextProps.onDragStart(event);
      }}
      onDragEnd={(event) => {
        edgeScroll.stopScroll();
        contextProps.onDragEnd(event);
      }}
      onDragCancel={() => {
        edgeScroll.stopScroll();
        contextProps.onDragCancel();
      }}
    >
      {/* pt-[100px]: PlannerView가 겹쳐 그리는 ViewModeToggle(top-40, 노드뷰와 동일 위치)과 헤더가 겹치지 않도록 여유를 둔다. */}
      <div className="flex h-full min-w-0 flex-col px-48 pt-[100px] pb-24">
        <header className="flex items-center justify-between">
          <h1 className="text-title-sb-24 text-gray-900">학기 플래너</h1>
          <Button
            label="과목추가"
            mode="primary_solid"
            icon={<Icon name="ic_plus" size={16} />}
            onClick={handleToggleSidebar}
          />
        </header>

        <div
          ref={scrollWrapperRef}
          className="mt-20 flex min-h-0 flex-1 [scrollbar-width:none] flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
          <GraduationStatusAccordion className="shrink-0" data={graduationData} />

          <div className="relative mt-24 min-h-360 flex-1">
            <section
              ref={boardRef}
              onScroll={updateScrollability}
              className="flex h-full [scrollbar-width:none] items-start gap-24 overflow-x-auto pb-20 [&::-webkit-scrollbar]:hidden"
            >
              {gridTerms.map((term, index) => {
                const cardRef = index === gridTerms.length - 1 ? handleLastCardRef : undefined;
                return term.status === 'planned' ? (
                  <DroppableTerm
                    key={term.id}
                    term={term}
                    cardRef={cardRef}
                    scrollToCourse={
                      scrollToCourse?.termId === term.id
                        ? { courseId: scrollToCourse.courseId, key: scrollToCourse.key }
                        : undefined
                    }
                    isDropTarget={overTermId === term.id}
                    onDeleteTerm={() => {
                      removeTerm(term.id);
                      toast.success(`${term.yearLevel}학년 ${term.semesterLabel}가 삭제되었어요.`);
                    }}
                    onAddFolder={() => handleAddFolder(term.id)}
                    onSelectFolder={(folderId) => selectFolder(term.id, folderId)}
                    onRenameFolder={(folderId, name) => renameFolder(term.id, folderId, name)}
                    onDeleteFolder={(folderId) => {
                      const folderName = term.folders.find(({ id }) => id === folderId)?.name ?? '';
                      deleteFolder(term.id, folderId);
                      toast.success(`'${folderName}' 폴더가 삭제되었어요.`);
                    }}
                  />
                ) : (
                  <SemesterCard
                    key={term.id}
                    ref={cardRef}
                    className="max-h-full"
                    yearLevel={term.yearLevel}
                    semester={term.semester}
                    semesterLabel={term.semesterLabel}
                    status={term.status}
                    folderName={getFolderName(term)}
                    totalCredit={getSelectedTotalCredit(term)}
                    courses={getSelectedCourses(term)}
                  />
                );
              })}
              <IconButton
                icon="ic_plus"
                aria-label="학기 추가"
                size="medium"
                className={cn(
                  'shrink-0',
                  addSemesterButtonTop === null ? 'self-center' : '-translate-y-1/2 self-start',
                )}
                style={addSemesterButtonTop === null ? undefined : { marginTop: addSemesterButtonTop }}
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
            className="shadow-small w-242 scale-105 border border-gray-100 opacity-85"
          />
        )}
      </DragOverlay>

      <AddSemesterModal open={isAddSemesterOpen} onOpenChange={setIsAddSemesterOpen} onSubmit={handleAddSemester} />
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
      {prerequisiteModal && (
        <PrerequisiteModal
          open
          onOpenChange={(open) => {
            if (!open) setPrerequisiteModal(null);
          }}
          type={prerequisiteModal.type}
          courseName={prerequisiteModal.courseName}
          prerequisiteName={prerequisiteModal.prerequisiteName}
          onConfirm={prerequisiteModal.onConfirm}
        />
      )}
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
