import type { GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';

const OTHER_REQUIRED_CODE_ORDER = ['SW_CERT_COURSE', 'ENGLISH_COURSE'];

export type OtherRequiredCondition = Pick<GraduationCondition, 'code' | 'name' | 'current' | 'required' | 'unit'>;

// SW/영어 인증의 current는 과목 소속 섹션(전공/교양/기타)별로 나뉘어 내려와 전 섹션 합산으로 계산한다
export const getOtherRequiredConditions = (
  sections: NonNullable<GraduationResponse['sections']>,
): OtherRequiredCondition[] => {
  const allSectionConditions = [
    ...sections.majors.flatMap(({ conditions }) => conditions),
    ...sections.ge.conditions,
    ...sections.others.conditions,
  ];

  return OTHER_REQUIRED_CODE_ORDER.flatMap((code) => {
    const matched = allSectionConditions.filter((condition) => condition.code === code);
    if (matched.length === 0) return [];
    const [{ name, required, unit }] = matched;
    return [{ code, name, current: matched.reduce((sum, { current }) => sum + current, 0), required, unit }];
  });
};
