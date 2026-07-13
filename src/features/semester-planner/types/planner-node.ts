export type MajorDivisionCategoryTypes = 'MAJOR_REQUIRED' | 'MAJOR_ELECTIVE' | 'MAJOR_BASIC';

// road-view(로드맵)가 화면에 그릴 때 쓰는 view-model. API 응답 자체의 타입은
// card-view와 공유하는 @features/semester-planner/types/planner를 따른다.
export interface NodeCardCourse {
  id: number;
  courseName: string;
  divisionCategory: string | null;
  divisionName: string | null;
}
