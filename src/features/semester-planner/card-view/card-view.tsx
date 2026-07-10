'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Toaster } from '@features/onboarding';
import {
  AddCourseSidebar,
  type Course,
} from '@features/semester-planner/card-view/add-course-sidebar/add-course-sidebar';
import {
  CourseFilterModal,
  type CourseFilterTabKeyTypes,
  type CourseFilterValues,
  getSelectedFilterLabels,
} from '@features/semester-planner/card-view/course-filter-modal/course-filter-modal';
import { DroppableTerm } from '@features/semester-planner/card-view/dnd/droppable-term';
import { LibraryCourse } from '@features/semester-planner/card-view/dnd/library-course';
import { useCardViewDnd } from '@features/semester-planner/card-view/dnd/use-card-view-dnd';
import { GraduationStatusAccordion } from '@features/semester-planner/card-view/graduation-status/graduation-status-accordion';
import { AddSemesterModal } from '@features/semester-planner/card-view/modals/add-semester-modal';
import { SemesterCard } from '@features/semester-planner/card-view/semester-card/semester-card';
import { getFolderName, getSelectedCourses, usePlannerTerms } from '@features/semester-planner/hooks/use-planner-terms';
import { MOCK_COURSE_SEARCH_ITEMS } from '@features/semester-planner/mocks/planner';
import { toSidebarCourse } from '@features/semester-planner/utils/map-planner';
import { Button } from '@shared/components/button/button';
import { ClassCard } from '@shared/components/class-card/class-card';
import Icon from '@shared/components/icon/icon';
import { IconButton } from '@shared/components/icon-button/icon-button';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

// TODO: API 연동 시 과목검색(GET /courses) 결과로 교체하고 필터 값을 쿼리 파라미터로 전달
const LIBRARY_COURSES = MOCK_COURSE_SEARCH_ITEMS.map(toSidebarCourse);

export const CardView = () => {
  const {
    plannedTerms,
    gridTerms,
    snapshot,
    restoreSnapshot,
    moveCourseToTerm,
    insertCourse,
    reorderCourse,
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
    reorderCourse,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<CourseFilterValues>();
  const [filterTab, setFilterTab] = useState<CourseFilterTabKeyTypes | null>(null);

  return (
    <DndContext id="card-view-dnd" {...contextProps}>
      <div className="flex h-full">
        <div className="flex min-w-0 flex-1 flex-col px-40 pt-16 pb-40">
          <header className="flex items-center justify-between">
            <h1 className="text-title-sb-24 text-gray-900">학기 플래너</h1>
            <div className="flex items-center gap-8">
              <Button
                label="과목추가"
                mode="primary_solid"
                icon={<Icon name="ic_plus" size={16} />}
                onClick={() => setIsSidebarOpen(true)}
              />
            </div>
          </header>

          <GraduationStatusAccordion className="mt-20" />

          <div className="relative mt-24 min-h-0 flex-1">
            <section className="flex h-full items-start gap-24 overflow-x-auto pb-20">
              {gridTerms.map((term) =>
                term.status === 'planned' ? (
                  <DroppableTerm
                    key={term.id}
                    term={term}
                    isDropTarget={overTermId === term.id}
                    onDeleteTerm={() => removeTerm(term.id)}
                    onAddFolder={() => addFolder(term.id)}
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
          </div>
        </div>

        <div
          className={cn(
            'h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out',
            isSidebarOpen ? 'w-300' : 'w-0',
          )}
        >
          <AddCourseSidebar
            courses={LIBRARY_COURSES}
            selectedFilterLabels={getSelectedFilterLabels(appliedFilters)}
            onClose={() => setIsSidebarOpen(false)}
            onDirectAdd={() => {}}
            renderCourse={(course: Course) => <LibraryCourse key={course.id} course={course} />}
          />
        </div>
      </div>

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

      <AddSemesterModal open={isAddSemesterOpen} onOpenChange={setIsAddSemesterOpen} onSubmit={() => {}} />
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
