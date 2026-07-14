'use client';

import { usePlanner } from '@features/semester-planner/hooks/use-planner';
import { useSavePlanner } from '@features/semester-planner/hooks/use-save-planner';
import type {
  PlannedTermResponse,
  PlannerFolder,
  PlannerTerm,
  SemesterCourse,
} from '@features/semester-planner/types/planner';
import {
  mapCompletedTerms,
  mapPlannedTerms,
  sortPlannerTerms,
  sortSemesterCourses,
  toPlannerSaveRequest,
} from '@features/semester-planner/utils/map-planner';
import { useEffect, useMemo, useRef, useState } from 'react';

export const getSelectedCourses = (term: PlannerTerm): SemesterCourse[] =>
  sortSemesterCourses(term.folders.find(({ id }) => id === term.selectedFolderId)?.courses ?? []);

export const getFolderName = ({ yearLevel, semesterLabel, selectedFolderId, folders }: PlannerTerm): string => {
  const selectedFolder = folders.find(({ id }) => id === selectedFolderId);
  return selectedFolder?.name ?? `${yearLevel}학년 ${semesterLabel}`;
};

const getNextFolderSeq = ({ yearLevel, semesterLabel, folders }: PlannerTerm): number => {
  const prefix = `${yearLevel}학년 ${semesterLabel}(`;
  const seqs = folders
    .filter(({ name }) => name.startsWith(prefix) && name.endsWith(')'))
    .map(({ name }) => Number(name.slice(prefix.length, -1)))
    .filter((seq) => Number.isInteger(seq) && seq > 0);
  return seqs.length > 0 ? Math.max(...seqs) + 1 : 1;
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

const applyCourseMove = (terms: PlannerTerm[], activeId: string, targetTermId: string): PlannerTerm[] | null => {
  const origin = terms.find((term) => getSelectedCourses(term).some(({ id }) => id === activeId));
  if (!origin || origin.id === targetTermId) return null;
  const course = getSelectedCourses(origin).find(({ id }) => id === activeId);
  if (!course) return null;
  return terms.map((term) => {
    if (term.id === origin.id) {
      return updateSelectedCourses(term, (courses) => courses.filter(({ id }) => id !== activeId));
    }
    if (term.id === targetTermId) {
      return updateSelectedCourses(term, (courses) => [...courses, course]);
    }
    return term;
  });
};

interface AddTermInput {
  yearLevel: number;
  semester: number;
  semesterLabel: string;
}

export const usePlannerTerms = () => {
  const { data: planner, isLoading, isError, error, refetch: refetchPlanner } = usePlanner();
  const [plannedTerms, setPlannedTerms] = useState<PlannerTerm[]>([]);
  const snapshotRef = useRef<PlannerTerm[] | null>(null);
  const createdIdSeqRef = useRef(0);
  const isSeededRef = useRef(false);

  const reseedPlannedTerms = async (serverPlannedTerms: PlannedTermResponse[] | null) => {
    if (serverPlannedTerms) {
      setPlannedTerms(mapPlannedTerms(serverPlannedTerms));
      return;
    }
    const { data: latestPlanner } = await refetchPlanner();
    if (latestPlanner) setPlannedTerms(mapPlannedTerms(latestPlanner.plannedTerms));
  };

  const { mutate: requestSavePlanner } = useSavePlanner({ onSaveError: reseedPlannedTerms });

  useEffect(() => {
    if (!planner || isSeededRef.current) return;
    isSeededRef.current = true;
    setPlannedTerms(mapPlannedTerms(planner.plannedTerms));
  }, [planner]);

  const previewPlannedTerms = (next: PlannerTerm[]) => {
    setPlannedTerms(next);
  };

  const commitPlannedTerms = (next: PlannerTerm[]) => {
    setPlannedTerms(next);
    requestSavePlanner(toPlannerSaveRequest(next));
  };

  const completedTerms = useMemo(() => (planner ? mapCompletedTerms(planner.completedTerms) : []), [planner]);
  const gridTerms = useMemo(
    () => sortPlannerTerms([...completedTerms, ...plannedTerms]),
    [completedTerms, plannedTerms],
  );

  const snapshot = () => {
    snapshotRef.current = plannedTerms;
  };

  const restoreSnapshot = () => {
    if (snapshotRef.current) previewPlannedTerms(snapshotRef.current);
  };

  const previewCourseMove = (activeId: string, targetTermId: string) => {
    const next = applyCourseMove(plannedTerms, activeId, targetTermId);
    if (next) previewPlannedTerms(next);
  };

  const dropCourseToTerm = (activeId: string, targetTermId: string) => {
    const next = applyCourseMove(plannedTerms, activeId, targetTermId);
    commitPlannedTerms(next ?? plannedTerms);
  };

  const insertCourse = (termId: string, course: SemesterCourse) => {
    const next = plannedTerms.map((term) =>
      term.id !== termId ? term : updateSelectedCourses(term, (courses) => [...courses, course]),
    );
    commitPlannedTerms(next);
  };

  const removeCourse = (courseId: string) => {
    const next = plannedTerms.map((term) =>
      getSelectedCourses(term).some(({ id }) => id === courseId)
        ? updateSelectedCourses(term, (courses) => courses.filter(({ id }) => id !== courseId))
        : term,
    );
    commitPlannedTerms(next);
  };

  const addTerm = ({ yearLevel, semester, semesterLabel }: AddTermInput): boolean => {
    const isDuplicate = [...completedTerms, ...plannedTerms].some(
      (term) => term.yearLevel === yearLevel && term.semesterLabel === semesterLabel,
    );
    if (isDuplicate) return false;

    createdIdSeqRef.current += 1;
    const folderId = `folder-new-${createdIdSeqRef.current}`;
    const next = sortPlannerTerms([
      ...plannedTerms,
      {
        id: `term-new-${createdIdSeqRef.current}`,
        yearLevel,
        semester,
        semesterLabel,
        status: 'planned' as const,
        selectedFolderId: folderId,
        folders: [{ id: folderId, name: `${yearLevel}학년 ${semesterLabel}(1)`, courses: [] }],
      },
    ]);
    commitPlannedTerms(next);
    return true;
  };

  const removeTerm = (termId: string) => {
    commitPlannedTerms(plannedTerms.filter(({ id }) => id !== termId));
  };

  const addFolder = (termId: string): PlannerTerm | null => {
    const term = plannedTerms.find(({ id }) => id === termId);
    if (!term) return null;
    createdIdSeqRef.current += 1;
    const newFolder: PlannerFolder = {
      id: `folder-new-${createdIdSeqRef.current}`,
      name: `${term.yearLevel}학년 ${term.semesterLabel}(${getNextFolderSeq(term)})`,
      courses: [],
    };
    const next = plannedTerms.map((prevTerm) =>
      prevTerm.id === termId ? { ...prevTerm, folders: [...prevTerm.folders, newFolder] } : prevTerm,
    );
    commitPlannedTerms(next);
    return term;
  };

  const selectFolder = (termId: string, folderId: string) => {
    const next = plannedTerms.map((term) => (term.id === termId ? { ...term, selectedFolderId: folderId } : term));
    commitPlannedTerms(next);
  };

  const renameFolder = (termId: string, folderId: string, name: string) => {
    const next = plannedTerms.map((term) => {
      if (term.id !== termId) return term;
      return {
        ...term,
        folders: term.folders.map((folder) => (folder.id === folderId ? { ...folder, name } : folder)),
      };
    });
    commitPlannedTerms(next);
  };

  const deleteFolder = (termId: string, folderId: string) => {
    const next = plannedTerms.flatMap((term) => {
      if (term.id !== termId) return term;
      const remainingFolders = term.folders.filter(({ id }) => id !== folderId);
      if (remainingFolders.length === 0) return [];
      const selectedFolderId = term.selectedFolderId === folderId ? remainingFolders[0].id : term.selectedFolderId;
      return { ...term, folders: remainingFolders, selectedFolderId };
    });
    commitPlannedTerms(next);
  };

  return {
    isLoading,
    isError,
    error,
    refetchPlanner,
    completedTerms,
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
  };
};
