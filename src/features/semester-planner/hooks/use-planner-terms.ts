'use client';

import { checkPrerequisite } from '@features/semester-planner/apis/check-prerequisite';
import {
  comparePlannerTerms,
  getLatestCompletedOrCurrentTerm,
  isPastPlannerTerm,
} from '@features/semester-planner/constants';
import { usePlanner } from '@features/semester-planner/hooks/use-planner';
import { useSavePlanner } from '@features/semester-planner/hooks/use-save-planner';
import type {
  PlannedTermResponse,
  PlannerFolder,
  PlannerTerm,
  SemesterCourse,
} from '@features/semester-planner/types/planner';
import {
  isSamePlannerComposition,
  mapCompletedTerms,
  mapPlannedTerms,
  mergeServerTotalCredits,
  sortSemesterCourses,
  toPlannerSaveRequest,
} from '@features/semester-planner/utils/map-planner';
import { toast } from '@shared/components';
import { useEffect, useMemo, useRef, useState } from 'react';

export const getSelectedCourses = (term: PlannerTerm): SemesterCourse[] =>
  sortSemesterCourses(term.folders.find(({ id }) => id === term.selectedFolderId)?.courses ?? []);

export const getSelectedTotalCredit = (term: PlannerTerm): number =>
  term.folders.find(({ id }) => id === term.selectedFolderId)?.totalCredit ?? 0;

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

export type AddTermResult = 'added' | 'duplicate' | 'past';

const insertPlannedTerm = (terms: PlannerTerm[], newTerm: PlannerTerm): PlannerTerm[] => {
  const insertIndex = terms.findIndex((term) => comparePlannerTerms(newTerm, term) < 0);
  if (insertIndex === -1) return [...terms, newTerm];
  return [...terms.slice(0, insertIndex), newTerm, ...terms.slice(insertIndex)];
};

export interface DeleteFolderResult {
  /** 삭제된 폴더가 그 학기의 마지막 폴더여서, 학기(컬럼) 자체가 통째로 사라졌는지 */
  isTermRemoved: boolean;
  /** 삭제된 폴더가 활성 폴더였다면, 새로 활성 폴더가 된 폴더 id (아니면 null) */
  promotedFolderId: string | null;
}

// plannedTerms와 isSeeded를 한 state로 묶어, 시드 effect가 setState를 한 번만 호출하고도
// plannedTerms가 실제로 채워진 바로 그 렌더에 isSeeded도 함께 true가 되게 한다 — 그래야 소비하는 쪽
// (RoadmapView 등)이 "isFetching은 끝났는데 plannedTerms는 아직 빈 배열"인 한 렌더짜리 경합을 보지 않는다.
// effect의 시드 여부 판단 자체는(자기 자신이 쓰는 state를 다시 읽으면 cascading render로 취급되므로)
// state가 아닌 ref로 가드한다.
interface PlannedTermsState {
  terms: PlannerTerm[];
  isSeeded: boolean;
}

export const usePlannerTerms = () => {
  const { data: planner, isLoading, isFetching, isError, error, refetch: refetchPlanner } = usePlanner();
  const [plannedState, setPlannedState] = useState<PlannedTermsState>({ terms: [], isSeeded: false });
  const plannedTerms = plannedState.terms;
  const isSeeded = plannedState.isSeeded;
  const snapshotRef = useRef<PlannerTerm[] | null>(null);
  const createdIdSeqRef = useRef(0);
  const isSeededRef = useRef(false);
  const saveSeqRef = useRef(0);
  const isValidatingRef = useRef(false);

  const setPlannedTerms = (terms: PlannerTerm[]) => {
    setPlannedState((prev) => ({ ...prev, terms }));
  };

  const reseedPlannedTerms = async (serverPlannedTerms: PlannedTermResponse[] | null) => {
    if (serverPlannedTerms) {
      setPlannedTerms(mapPlannedTerms(serverPlannedTerms));
      return;
    }
    const { data: latestPlanner } = await refetchPlanner();
    if (latestPlanner) setPlannedTerms(mapPlannedTerms(latestPlanner.plannedTerms));
  };

  const { mutateAsync: requestSavePlanner } = useSavePlanner({ onSaveError: reseedPlannedTerms });
  // 마지막 저장 요청의 완료(성공/실패 무관) 시점. 저장 직후 다른 화면으로 전환해야 하는 흐름(노드뷰의
  // 학기/폴더 추가)에서, 전환된 화면이 새로 GET하기 전에 이 저장이 먼저 끝나도록 기다리는 용도다.
  const lastSavePromiseRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!planner || isFetching || isSeededRef.current) return;
    isSeededRef.current = true;
    setPlannedState({ terms: mapPlannedTerms(planner.plannedTerms), isSeeded: true });
  }, [planner, isFetching]);

  const previewPlannedTerms = (next: PlannerTerm[]) => {
    setPlannedTerms(next);
  };

  // 과목 카드를 새로 추가하는 액션(insertCourse)만 재수강 안내 토스트를 띄운다.
  // hasDuplicateCourse는 저장 시점의 전체 상태를 기준으로 내려오는 값이라, 폴더/학기 추가·삭제 등
  // 다른 액션에서도 true일 수 있어 여기서 무조건 확인하면 안 된다.
  const commitPlannedTerms = (next: PlannerTerm[], options?: { notifyDuplicateCourse?: boolean }) => {
    setPlannedTerms(next);
    const saveSeq = ++saveSeqRef.current;
    const savePromise = requestSavePlanner(toPlannerSaveRequest(next));
    savePromise
      .then(async (data) => {
        if (options?.notifyDuplicateCourse && data?.hasDuplicateCourse) {
          toast.notice('재수강 과목이에요. 기존 이수 학점은 제외되고 현재 학기에 반영돼요.');
        }
        // 폴더 totalCredit 등 서버 계산값을 화면에 반영하기 위해 저장 성공마다 재조회한다.
        // 재조회가 도착하기 전에 새 편집(새 저장)이 시작됐으면, 낡은 응답으로 최신 로컬 상태를 덮지 않는다.
        if (saveSeq !== saveSeqRef.current) return;
        const { data: latestPlanner } = await refetchPlanner();
        if (saveSeq !== saveSeqRef.current) return;
        if (!latestPlanner) return;
        // 응답 구성이 저장본과 같으면(정상 경로) 서버 계산값만 끼워 넣고,
        // 다르면(외부 변경·서버 변형) 서버를 진실로 삼아 전체 재시드한다.
        if (isSamePlannerComposition(next, latestPlanner.plannedTerms)) {
          setPlannedState((prev) => ({
            ...prev,
            terms: mergeServerTotalCredits(prev.terms, latestPlanner.plannedTerms),
          }));
        } else {
          setPlannedTerms(mapPlannedTerms(latestPlanner.plannedTerms));
        }
      })
      .catch(() => {});
    lastSavePromiseRef.current = savePromise.catch(() => {});
  };

  const waitForSave = () => lastSavePromiseRef.current;

  // 저장 후 서버가 plannerTermId를 재할당하는 경우를 대비해, save 완료 후 refetch해서
  // 현재 학기(staleTermId)에 대응하는 신선한 plannerTermId를 반환한다.
  const resolveTermId = async (staleTermId: string): Promise<number | undefined> => {
    await waitForSave();
    const { data: latestPlanner } = await refetchPlanner();
    if (!latestPlanner) return undefined;
    const termInState = plannedTerms.find(({ id }) => id === staleTermId);
    if (!termInState) return undefined;
    const freshTerm = mapPlannedTerms(latestPlanner.plannedTerms).find(
      (t) => t.yearLevel === termInState.yearLevel && t.semester === termInState.semester,
    );
    const parsed = Number(freshTerm?.id);
    return isNaN(parsed) ? undefined : parsed;
  };

  const validateAndCleanPrerequisites = async (): Promise<{ courseName: string; prerequisiteName: string }[]> => {
    if (isValidatingRef.current) return [];
    isValidatingRef.current = true;
    try {
      await waitForSave();
      const { data: latestPlanner } = await refetchPlanner();
      if (!latestPlanner) return [];

      const latestTerms = mapPlannedTerms(latestPlanner.plannedTerms);
      const violations: { courseId: number; courseName: string; prerequisiteName: string; termId: string }[] = [];

      await Promise.all(
        latestTerms.map(async (term) => {
          const courses = getSelectedCourses(term);
          if (courses.length === 0) return;
          const numericTermId = Number(term.id);
          if (isNaN(numericTermId)) return;
          try {
            const result = await checkPrerequisite(
              courses.map((c) => c.courseId),
              numericTermId,
            );
            result.results.forEach((r) => {
              const requiredMissing = r.missingPrerequisites.find((p) => p.type === 'REQUIRED');
              if (!requiredMissing) return;
              const course = courses.find((c) => c.courseId === r.courseId);
              if (!course) return;
              violations.push({
                courseId: r.courseId,
                courseName: course.name,
                prerequisiteName: requiredMissing.name,
                termId: term.id,
              });
            });
          } catch {
            // 학기별 검사 실패는 무시하고 나머지 학기 계속 검사
          }
        }),
      );

      if (violations.length === 0) return [];

      const removalMap = new Map<string, Set<number>>();
      for (const v of violations) {
        if (!removalMap.has(v.termId)) removalMap.set(v.termId, new Set());
        removalMap.get(v.termId)!.add(v.courseId);
      }

      const cleaned = latestTerms.map((term) => {
        const toRemove = removalMap.get(term.id);
        if (!toRemove) return term;
        return updateSelectedCourses(term, (courses) => courses.filter((c) => !toRemove.has(c.courseId)));
      });

      commitPlannedTerms(cleaned);
      return violations.map(({ courseName, prerequisiteName }) => ({ courseName, prerequisiteName }));
    } finally {
      isValidatingRef.current = false;
    }
  };

  const completedTerms = useMemo(() => (planner ? mapCompletedTerms(planner.completedTerms) : []), [planner]);
  const gridTerms = useMemo(() => [...completedTerms, ...plannedTerms], [completedTerms, plannedTerms]);

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
    commitPlannedTerms(next, { notifyDuplicateCourse: true });
  };

  const removeCourse = (courseId: string) => {
    const next = plannedTerms.map((term) =>
      getSelectedCourses(term).some(({ id }) => id === courseId)
        ? updateSelectedCourses(term, (courses) => courses.filter(({ id }) => id !== courseId))
        : term,
    );
    commitPlannedTerms(next);
  };

  const addTerm = ({ yearLevel, semester, semesterLabel }: AddTermInput): AddTermResult => {
    const isDuplicate = [...completedTerms, ...plannedTerms].some(
      (term) => term.yearLevel === yearLevel && term.semesterLabel === semesterLabel,
    );
    if (isDuplicate) return 'duplicate';

    const latestCompletedOrCurrentTerm = getLatestCompletedOrCurrentTerm(completedTerms);
    if (latestCompletedOrCurrentTerm && isPastPlannerTerm({ yearLevel, semester }, latestCompletedOrCurrentTerm)) {
      return 'past';
    }

    createdIdSeqRef.current += 1;
    const folderId = `folder-new-${createdIdSeqRef.current}`;
    const newTerm: PlannerTerm = {
      id: `term-new-${createdIdSeqRef.current}`,
      yearLevel,
      semester,
      semesterLabel,
      status: 'planned',
      selectedFolderId: folderId,
      folders: [{ id: folderId, name: `${yearLevel}학년 ${semesterLabel}(1)`, courses: [], totalCredit: 0 }],
    };
    commitPlannedTerms(insertPlannedTerm(plannedTerms, newTerm));
    return 'added';
  };

  const removeTerm = (termId: string) => {
    commitPlannedTerms(plannedTerms.filter(({ id }) => id !== termId));
  };

  const addFolder = (termId: string, options?: { select?: boolean }): PlannerFolder | null => {
    const term = plannedTerms.find(({ id }) => id === termId);
    if (!term) return null;
    createdIdSeqRef.current += 1;
    const newFolder: PlannerFolder = {
      id: `folder-new-${createdIdSeqRef.current}`,
      name: `${term.yearLevel}학년 ${term.semesterLabel}(${getNextFolderSeq(term)})`,
      courses: [],
      totalCredit: 0,
    };
    const next = plannedTerms.map((prevTerm) =>
      prevTerm.id === termId
        ? {
            ...prevTerm,
            folders: [...prevTerm.folders, newFolder],
            selectedFolderId: options?.select ? newFolder.id : prevTerm.selectedFolderId,
          }
        : prevTerm,
    );
    commitPlannedTerms(next);
    return newFolder;
  };

  // 노드뷰의 엣지 연결 하나가 두 학기의 활성 폴더를 동시에 바꿀 수 있어, 한 번의 커밋으로 묶어 반영한다.
  // 두 번 나눠 selectFolder를 호출하면 두 번째 호출이 첫 번째 변경 전의 plannedTerms를 기준으로 계산돼 덮어써진다.
  const selectFolders = (selections: { termId: string; folderId: string }[]) => {
    const folderIdByTermId = new Map(selections.map(({ termId, folderId }) => [termId, folderId]));
    const next = plannedTerms.map((term) => {
      const folderId = folderIdByTermId.get(term.id);
      return folderId ? { ...term, selectedFolderId: folderId } : term;
    });
    commitPlannedTerms(next);
  };

  const selectFolder = (termId: string, folderId: string) => selectFolders([{ termId, folderId }]);

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

  const deleteFolder = (termId: string, folderId: string): DeleteFolderResult => {
    const term = plannedTerms.find(({ id }) => id === termId);
    if (!term) return { isTermRemoved: false, promotedFolderId: null };

    const remainingFolders = term.folders.filter(({ id }) => id !== folderId);
    const isTermRemoved = remainingFolders.length === 0;
    const promotedFolderId = !isTermRemoved && term.selectedFolderId === folderId ? remainingFolders[0].id : null;

    const next = plannedTerms.flatMap((prevTerm) => {
      if (prevTerm.id !== termId) return prevTerm;
      if (isTermRemoved) return [];
      const selectedFolderId = promotedFolderId ?? prevTerm.selectedFolderId;
      return { ...prevTerm, folders: remainingFolders, selectedFolderId };
    });
    commitPlannedTerms(next);
    return { isTermRemoved, promotedFolderId };
  };

  const reorderFolders = (termId: string, orderedFolderIds: string[]) => {
    const next = plannedTerms.map((term) => {
      if (term.id !== termId) return term;
      const folderById = new Map(term.folders.map((folder) => [folder.id, folder]));
      const folders = orderedFolderIds
        .map((id) => folderById.get(id))
        .filter((folder): folder is PlannerFolder => folder !== undefined);
      return { ...term, folders };
    });
    commitPlannedTerms(next);
  };

  return {
    isLoading,
    isFetching,
    isError,
    error,
    isSeeded,
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
    selectFolders,
    renameFolder,
    deleteFolder,
    reorderFolders,
    waitForSave,
    resolveTermId,
    validateAndCleanPrerequisites,
  };
};
