'use client';

import { arrayMove } from '@dnd-kit/sortable';
import type { SemesterCourse } from '@features/semester-planner/card-view/semester-card/semester-card';
import { MOCK_PLANNER_RESPONSE } from '@features/semester-planner/mocks/planner';
import type { PlannerFolder, PlannerTerm } from '@features/semester-planner/types/planner';
import { mapCompletedTerms, mapPlannedTerms, sortPlannerTerms } from '@features/semester-planner/utils/map-planner';
import { useMemo, useRef, useState } from 'react';

const COMPLETED_TERMS = mapCompletedTerms(MOCK_PLANNER_RESPONSE.completedTerms);
const INITIAL_PLANNED_TERMS = mapPlannedTerms(MOCK_PLANNER_RESPONSE.plannedTerms);

export const getSelectedCourses = (term: PlannerTerm): SemesterCourse[] =>
  term.folders.find(({ id }) => id === term.selectedFolderId)?.courses ?? [];

export const getFolderName = ({ yearLevel, semesterLabel, selectedFolderId, folders }: PlannerTerm): string => {
  const selectedFolder = folders.find(({ id }) => id === selectedFolderId);
  return selectedFolder?.name ?? `${yearLevel}학년 ${semesterLabel}`;
};

const updateSelectedCourses = (
  term: PlannerTerm,
  update: (courses: SemesterCourse[]) => SemesterCourse[],
): PlannerTerm => ({
  ...term,
  folders: term.folders.map((folder) =>
    folder.id === term.selectedFolderId ? { ...folder, courses: update(folder.courses) } : folder,
  ),
});

interface AddTermInput {
  yearLevel: number;
  semester: number;
  semesterLabel: string;
}

export const usePlannerTerms = () => {
  const [plannedTerms, setPlannedTerms] = useState<PlannerTerm[]>(INITIAL_PLANNED_TERMS);
  const snapshotRef = useRef<PlannerTerm[] | null>(null);
  const createdIdSeqRef = useRef(0);

  const completedTerms = COMPLETED_TERMS;
  const gridTerms = useMemo(() => sortPlannerTerms([...COMPLETED_TERMS, ...plannedTerms]), [plannedTerms]);

  const snapshot = () => {
    snapshotRef.current = plannedTerms;
  };

  const restoreSnapshot = () => {
    if (snapshotRef.current) setPlannedTerms(snapshotRef.current);
  };

  const moveCourseToTerm = (activeId: string, targetTermId: string, insertBeforeId: string | null) => {
    setPlannedTerms((prev) => {
      const origin = prev.find((term) => getSelectedCourses(term).some(({ id }) => id === activeId));
      if (!origin || origin.id === targetTermId) return prev;
      const course = getSelectedCourses(origin).find(({ id }) => id === activeId);
      if (!course) return prev;
      return prev.map((term) => {
        if (term.id === origin.id) {
          return updateSelectedCourses(term, (courses) => courses.filter(({ id }) => id !== activeId));
        }
        if (term.id === targetTermId) {
          return updateSelectedCourses(term, (courses) => {
            const overIndex = insertBeforeId ? courses.findIndex(({ id }) => id === insertBeforeId) : -1;
            const insertIndex = overIndex >= 0 ? overIndex : courses.length;
            const next = [...courses];
            next.splice(insertIndex, 0, course);
            return next;
          });
        }
        return term;
      });
    });
  };

  const insertCourse = (termId: string, course: SemesterCourse, insertBeforeId: string | null) => {
    setPlannedTerms((prev) =>
      prev.map((term) => {
        if (term.id !== termId) return term;
        return updateSelectedCourses(term, (courses) => {
          const overIndex = insertBeforeId ? courses.findIndex(({ id }) => id === insertBeforeId) : -1;
          const insertIndex = overIndex >= 0 ? overIndex : courses.length;
          const next = [...courses];
          next.splice(insertIndex, 0, course);
          return next;
        });
      }),
    );
  };

  const reorderCourse = (termId: string, activeId: string, overId: string) => {
    setPlannedTerms((prev) =>
      prev.map((term) => {
        if (term.id !== termId) return term;
        return updateSelectedCourses(term, (courses) => {
          const oldIndex = courses.findIndex(({ id }) => id === activeId);
          const newIndex = courses.findIndex(({ id }) => id === overId);
          if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return courses;
          return arrayMove(courses, oldIndex, newIndex);
        });
      }),
    );
  };

  const addTerm = ({ yearLevel, semester, semesterLabel }: AddTermInput): boolean => {
    const isDuplicate = [...COMPLETED_TERMS, ...plannedTerms].some(
      (term) => term.yearLevel === yearLevel && term.semesterLabel === semesterLabel,
    );
    if (isDuplicate) return false;

    createdIdSeqRef.current += 1;
    const folderId = `folder-new-${createdIdSeqRef.current}`;
    setPlannedTerms((prev) =>
      sortPlannerTerms([
        ...prev,
        {
          id: `term-new-${createdIdSeqRef.current}`,
          yearLevel,
          semester,
          semesterLabel,
          status: 'planned' as const,
          selectedFolderId: folderId,
          folders: [{ id: folderId, name: `${yearLevel}학년 ${semesterLabel}(1)`, courses: [] }],
        },
      ]),
    );
    return true;
  };

  const removeTerm = (termId: string) => {
    setPlannedTerms((prev) => prev.filter(({ id }) => id !== termId));
  };

  const addFolder = (termId: string): PlannerTerm | null => {
    const term = plannedTerms.find(({ id }) => id === termId);
    if (!term) return null;
    createdIdSeqRef.current += 1;
    const newFolder: PlannerFolder = {
      id: `folder-new-${createdIdSeqRef.current}`,
      name: `${term.yearLevel}학년 ${term.semesterLabel}(${term.folders.length + 1})`,
      courses: [],
    };
    setPlannedTerms((prev) =>
      prev.map((prevTerm) =>
        prevTerm.id === termId ? { ...prevTerm, folders: [...prevTerm.folders, newFolder] } : prevTerm,
      ),
    );
    return term;
  };

  const selectFolder = (termId: string, folderId: string) => {
    setPlannedTerms((prev) =>
      prev.map((term) => (term.id === termId ? { ...term, selectedFolderId: folderId } : term)),
    );
  };

  const renameFolder = (termId: string, folderId: string, name: string) => {
    setPlannedTerms((prev) =>
      prev.map((term) => {
        if (term.id !== termId) return term;
        return {
          ...term,
          folders: term.folders.map((folder) => (folder.id === folderId ? { ...folder, name } : folder)),
        };
      }),
    );
  };

  const deleteFolder = (termId: string, folderId: string) => {
    setPlannedTerms((prev) =>
      prev.flatMap((term) => {
        if (term.id !== termId) return term;
        const remainingFolders = term.folders.filter(({ id }) => id !== folderId);
        if (remainingFolders.length === 0) return [];
        const selectedFolderId = term.selectedFolderId === folderId ? remainingFolders[0].id : term.selectedFolderId;
        return { ...term, folders: remainingFolders, selectedFolderId };
      }),
    );
  };

  return {
    completedTerms,
    plannedTerms,
    gridTerms,
    snapshot,
    restoreSnapshot,
    moveCourseToTerm,
    insertCourse,
    reorderCourse,
    addTerm,
    removeTerm,
    addFolder,
    selectFolder,
    renameFolder,
    deleteFolder,
  };
};
