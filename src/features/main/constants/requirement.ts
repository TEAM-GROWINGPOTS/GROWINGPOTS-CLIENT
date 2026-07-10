import type { RequirementSemester } from '@features/main/types/requirement';
import type { GraduationUnit } from '@shared/apis/types/graduation';

export const CURRENT_ONLY_CODES = new Set<string>(['GRADUATION_REQUIRED', 'GENERAL_ELECTIVE']);
export const HIDDEN_BADGE_CODES = new Set<string>(['GENERAL_ELECTIVE']);
export const INFORMATION_CODES = new Set<string>(['GRADUATION_REQUIRED', 'REQUIRED_GE', 'DISTRIBUTED_GE', 'FREE_GE']);
export const NOTICE_CODES = new Set<string>(['GRADUATION_REQUIRED', 'REQUIRED_GE', 'DISTRIBUTED_GE']);

export const SEMESTER_LABELS: Record<RequirementSemester, string> = {
  FIRST: '1학기',
  SECOND: '2학기',
};

export const REQUIREMENT_UNIT_LABELS: Record<GraduationUnit, string> = {
  CREDITS: '학점',
  COURSES: '과목',
};

export const INFORMATION_CONTENTS: Record<string, string> = {
  GRADUATION_REQUIRED: '(임시)졸업필수 요건에 해당하는 [전문실기(2과목)], [맨손체조] 이수 필요',
  REQUIRED_GE: '(임시)필수 교과 영역별 이수 조건을 확인해 주세요.',
  DISTRIBUTED_GE: '(임시)배분 이수 교과 영역별 이수 조건을 확인해 주세요.',
  FREE_GE: '(임시)자유 이수 교과 인정 범위를 확인해 주세요.',
};
