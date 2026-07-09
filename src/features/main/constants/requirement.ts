import type { RequirementCode } from '@features/main/types/requirement';

export const CURRENT_ONLY_CODES = new Set<RequirementCode>(['GRADUATION_REQUIRED', 'GENERAL_ELECTIVE']);
export const HIDDEN_BADGE_CODES = new Set<RequirementCode>(['GENERAL_ELECTIVE']);
export const INFORMATION_CODES = new Set<RequirementCode>([
  'GRADUATION_REQUIRED',
  'REQUIRED_GE',
  'DISTRIBUTED_GE',
  'FREE_GE',
]);
export const NOTICE_CODES = new Set<RequirementCode>(['GRADUATION_REQUIRED', 'REQUIRED_GE', 'DISTRIBUTED_GE']);

export const MAJOR_TYPE_LABELS = {
  PRIMARY: '본전공',
  MULTI: '다전공',
} as const;

export const INFORMATION_CONTENTS: Partial<Record<RequirementCode, string>> = {
  GRADUATION_REQUIRED: '졸업필수 요건에 해당하는 [전문실기(2과목)], [맨손체조] 이수 필요',
  REQUIRED_GE: '필수 교과 영역별 이수 조건을 확인해 주세요.',
  DISTRIBUTED_GE: '배분 이수 교과 영역별 이수 조건을 확인해 주세요.',
  FREE_GE: '자유 이수 교과 인정 범위를 확인해 주세요.',
};
