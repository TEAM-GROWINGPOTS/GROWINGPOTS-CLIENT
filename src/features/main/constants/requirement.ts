import type { RequirementSemester } from '@features/main/types/requirement';
import type { GraduationUnit } from '@shared/apis/types/graduation';

export const CURRENT_ONLY_CODES = new Set<string>(['GRADUATION_REQUIRED', 'GENERAL_ELECTIVE']);
export const HIDDEN_BADGE_CODES = new Set<string>(['GENERAL_ELECTIVE']);
export const HIDDEN_MAJOR_NAME_CODES = new Set<string>(['ENGLISH_COURSE', 'SW_CERT_COURSE']);
export const INFORMATION_CODES = new Set<string>(['GRADUATION_REQUIRED', 'DISTRIBUTED_GE', 'FREE_GE']);
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
  GRADUATION_REQUIRED: '졸업필수 요건에 해당하는 [전문실기(2과목)], [맨손체조] 이수가 필요해요',
  FREE_GE: '전공탐색및기업가정신세미나(전공탐색세미나)는 필수과목이에요',
};

export const getRequirementInfoContent = (code: string, admissionYear?: number) => {
  if (code === 'REQUIRED_GE') {
    if (admissionYear === undefined || admissionYear < 2024) return undefined;

    return '[성찰과표현]은 [주제연구]의 선이수 과목이에요';
  }

  if (code === 'DISTRIBUTED_GE') {
    if (admissionYear !== undefined && admissionYear < 2024) {
      return '23학번까지는 영역 제한 없이 12학점 이상만 이수하면 통과예요.';
    }

    return '5개의 영역 중 3개 영역을 선택해 9학점 이상의 이수가 필요해요.';
  }

  return INFORMATION_CONTENTS[code];
};

export const hasRequirementInfo = (code: string, admissionYear?: number) => {
  if (code === 'REQUIRED_GE') return admissionYear !== undefined && admissionYear >= 2024;
  if (code === 'DISTRIBUTED_GE') return true;

  return INFORMATION_CODES.has(code);
};
