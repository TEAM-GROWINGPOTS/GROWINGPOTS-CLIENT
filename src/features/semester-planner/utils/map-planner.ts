import { getSemesterLabel } from '@features/semester-planner/constants';
import type {
  CompletedTermResponse,
  OpenedSemester,
  PlannedTermResponse,
  PlannerCourseBaseResponse,
  PlannerFolder,
  PlannerResponse,
  PlannerSaveRequest,
  PlannerTerm,
  PlannerVersionResponse,
  SemesterCourse,
} from '@features/semester-planner/types/planner';

const OPENED_SEMESTER_LABEL: Record<OpenedSemester, string> = {
  FIRST: '1학기',
  SECOND: '2학기',
  BOTH: '전체학기',
};

export const getCourseTags = (divisionName: string, credit: number, openedSemester: OpenedSemester): string[] => [
  divisionName,
  `${credit}학점`,
  OPENED_SEMESTER_LABEL[openedSemester],
];

const toCourseBase = (course: PlannerCourseBaseResponse) => ({
  courseId: course.courseId,
  departmentName: course.departmentName,
  name: course.name,
  tags: getCourseTags(course.divisionName, course.credit, course.openedSemester),
  credit: course.credit,
  divisionCategory: course.divisionCategory,
  divisionName: course.divisionName,
  isEnglish: course.isEnglish,
  isSw: course.isSw,
});

const DIVISION_ORDER = ['전공필수', '전공선택', '전공기초', '필수교과', '배분이수교과', '자유이수교과', '기타이수교과'];

const getDivisionRank = (divisionName: string): number => {
  const index = DIVISION_ORDER.indexOf(divisionName);
  return index === -1 ? DIVISION_ORDER.length : index;
};

export const sortSemesterCourses = (courses: SemesterCourse[]): SemesterCourse[] =>
  [...courses].sort(
    (a, b) =>
      getDivisionRank(a.divisionName) - getDivisionRank(b.divisionName) ||
      a.divisionName.localeCompare(b.divisionName, 'ko') ||
      a.name.localeCompare(b.name, 'ko'),
  );

const toPlannerFolder = (version: PlannerVersionResponse): PlannerFolder => ({
  id: String(version.plannerTermVersionId),
  name: version.name,
  courses: [...version.courses]
    .sort((a, b) => a.coursePositionOrder - b.coursePositionOrder)
    .map((course): SemesterCourse => ({ id: String(course.plannerVersionItemId), ...toCourseBase(course) })),
});

const toCompletedTerm = (term: CompletedTermResponse, index: number): PlannerTerm => {
  // plannerTermVersionId만으로 폴더(노드)를 식별하면, 휴학 등으로 같은 학년/학기가 반복될 때
  // 서버가 내려주는 versionId가 우연히 중복될 경우 노드뷰에서 같은 id의 노드가 서로 덮어써진다.
  // 배열 인덱스를 함께 섞어 항상 유일한 id가 되도록 한다.
  const folderId = `completed-${index}-${term.plannerTermVersionId}`;

  return {
    id: `completed-${term.yearLevel}-${term.semester}`,
    yearLevel: term.yearLevel,
    semester: term.semester,
    semesterLabel: getSemesterLabel(term.semester),
    status: term.status === 'IN_PROGRESS' ? 'current' : 'completed',
    selectedFolderId: folderId,
    folders: [
      {
        id: folderId,
        name: term.name,
        courses: term.courses.map((course): SemesterCourse => ({
          id: String(course.studentCourseId),
          ...toCourseBase(course),
        })),
      },
    ],
  };
};

const toPlannedTerm = (term: PlannedTermResponse): PlannerTerm => {
  const orderedVersions = [...term.versions].sort((a, b) => a.versionOrder - b.versionOrder);
  const selectedVersion = orderedVersions.find(({ isSelected }) => isSelected) ?? orderedVersions[0];

  return {
    id: String(term.plannerTermId),
    yearLevel: term.yearLevel,
    semester: term.semester,
    semesterLabel: getSemesterLabel(term.semester),
    status: 'planned',
    selectedFolderId: selectedVersion ? String(selectedVersion.plannerTermVersionId) : undefined,
    folders: orderedVersions.map(toPlannerFolder),
  };
};

export const mapCompletedTerms = (completedTerms: PlannerResponse['completedTerms']): PlannerTerm[] =>
  completedTerms.map((term, index) => toCompletedTerm(term, index));

export const mapPlannedTerms = (plannedTerms: PlannerResponse['plannedTerms']): PlannerTerm[] =>
  plannedTerms.map(toPlannedTerm);

export const toPlannerSaveRequest = (plannedTerms: PlannerTerm[]): PlannerSaveRequest => ({
  plannerSimulationId: null,
  terms: plannedTerms.map(({ yearLevel, semester, selectedFolderId, folders }) => ({
    yearLevel,
    semester,
    versions: folders.map((folder, folderIndex) => ({
      versionNo: folderIndex + 1,
      name: folder.name,
      isSelected: folder.id === selectedFolderId,
      versionOrder: folderIndex + 1,
      items: folder.courses.map(({ courseId }, courseIndex) => ({
        courseId,
        coursePositionOrder: courseIndex + 1,
      })),
    })),
  })),
});
