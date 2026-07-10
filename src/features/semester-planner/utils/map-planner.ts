import type { Course } from '../card-view/add-course-sidebar/add-course-sidebar';
import type {
  CompletedTermResponse,
  CourseSearchItemResponse,
  OpenedSemester,
  PlannedTermResponse,
  PlannerFolder,
  PlannerResponse,
  PlannerTerm,
  PlannerVersionResponse,
  SemesterCourse,
} from '../types/planner';

const OPENED_SEMESTER_LABEL: Record<OpenedSemester, string> = {
  FIRST: '1학기',
  SECOND: '2학기',
  BOTH: '전체학기',
};

interface PlannerCourseFields {
  courseName: string;
  departmentName: string;
  divisionName: string;
  openedSemester: OpenedSemester;
  credit: number;
}

const toCourseBase = (course: PlannerCourseFields) => ({
  department: course.departmentName,
  name: course.courseName,
  tags: [course.divisionName, `${course.credit}학점`, OPENED_SEMESTER_LABEL[course.openedSemester]],
  credit: course.credit,
});

const toPlannerFolder = (version: PlannerVersionResponse): PlannerFolder => ({
  id: String(version.plannerTermVersionId),
  name: version.name,
  courses: [...version.courses]
    .sort((a, b) => a.coursePositionOrder - b.coursePositionOrder)
    .map((course): SemesterCourse => ({ id: String(course.plannerVersionItemId), ...toCourseBase(course) })),
});

const toCompletedTerm = (term: CompletedTermResponse): PlannerTerm => {
  const folderId = String(term.plannerTermVersionId);

  return {
    id: `completed-${term.yearLevel}-${term.semester}`,
    yearLevel: term.yearLevel,
    semester: term.semester,
    semesterLabel: `${term.semester}학기`,
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
    semesterLabel: `${term.semester}학기`,
    status: 'planned',
    selectedFolderId: selectedVersion ? String(selectedVersion.plannerTermVersionId) : undefined,
    folders: orderedVersions.map(toPlannerFolder),
  };
};

export const sortPlannerTerms = (terms: PlannerTerm[]): PlannerTerm[] =>
  [...terms].sort((a, b) => a.yearLevel - b.yearLevel || a.semester - b.semester);

export const mapCompletedTerms = (completedTerms: PlannerResponse['completedTerms']): PlannerTerm[] =>
  sortPlannerTerms(completedTerms.map(toCompletedTerm));

export const mapPlannedTerms = (plannedTerms: PlannerResponse['plannedTerms']): PlannerTerm[] =>
  sortPlannerTerms(plannedTerms.map(toPlannedTerm));

export const toSidebarCourse = ({
  courseId,
  name,
  credit,
  departmentName,
  defaultDivisionName,
  openedSemester,
  isEnglish,
  isSw,
}: CourseSearchItemResponse): Course => ({
  id: courseId,
  department: departmentName,
  title: name,
  tags: [defaultDivisionName, `${credit}학점`, OPENED_SEMESTER_LABEL[openedSemester]],
  credit,
  isEnglish,
  isSw,
});
