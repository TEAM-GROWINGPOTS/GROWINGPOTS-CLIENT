import type {
  CertResult,
  CertType,
  Condition,
  ConditionCode,
  GraduationStatusData,
} from '@shared/types/graduation-status';

import type { RequirementCardProps, RequirementVariant } from '../graduation-result/requirement-card';

const CONDITION_CARD_CONFIG: Record<ConditionCode, { label: string; variant?: RequirementVariant }> = {
  MAJOR_BASIC: { label: '전공 기초', variant: 'dark' },
  MAJOR_REQUIRED: { label: '전공 필수', variant: 'dark' },
  MAJOR_ELECTIVE: { label: '전공 선택', variant: 'dark' },
  REQUIRED_GE: { label: '필수교과' },
  DISTRIBUTED_GE: { label: '배분이수교과' },
  FREE_GE: { label: '자유이수' },
  GENERAL_ELECTIVE: { label: '기타' },
  ENGLISH_COURSE: { label: '영어' },
  SW_CERT_COURSE: { label: 'SW인증', variant: 'dark' },
};

const CERT_CARD_LABEL: Partial<Record<CertType, string>> = {
  THESIS: '논문',
  GRADUATION_CERT: '졸업능력인증',
  TOPIK: '한국어능력인증',
};

const CERT_RESULT_VALUE: Record<CertResult, { value: string; disabled?: boolean }> = {
  PASS: { value: '통과' },
  FAIL: { value: '미통과' },
  EXEMPT: { value: '면제' },
  NONE: { value: '해당 없음', disabled: true },
};

const conditionToCard = (condition: Condition): RequirementCardProps => {
  const { label, variant } = CONDITION_CARD_CONFIG[condition.code];
  const total =
    condition.required !== null ? `/${condition.required}${condition.unit === 'CREDITS' ? '학점' : '과목'}` : undefined;

  return { label, value: `${condition.current}`, total, variant };
};

const dedupeByCode = (conditions: Condition[]) => {
  const seenCodes = new Set<ConditionCode>();

  return conditions.filter(({ code }) => {
    if (seenCodes.has(code)) return false;
    seenCodes.add(code);
    return true;
  });
};

export const toRequirementCards = ({
  summary,
  conditions,
  sections,
  certs,
}: GraduationStatusData): RequirementCardProps[] => {
  const allConditions = sections
    ? dedupeByCode([...sections.primary.conditions, ...sections.ge.conditions, ...sections.others.conditions])
    : (conditions ?? []);

  const conditionCards = allConditions.filter(({ code }) => code !== 'GENERAL_ELECTIVE').map(conditionToCard);

  const certCards = certs.flatMap(({ certType, result }): RequirementCardProps[] => {
    const label = CERT_CARD_LABEL[certType];
    if (!label) return [];

    const variant: RequirementVariant | undefined =
      certType === 'GRADUATION_CERT' && result === 'PASS' ? 'highlight' : undefined;

    return [{ label, variant, ...CERT_RESULT_VALUE[result] }];
  });

  return [
    { label: '총 학점', value: `${summary.totalCredits.current}`, total: `/${summary.totalCredits.required}학점` },
    {
      label: '졸업 평점',
      value: `${summary.gpa.current}`,
      total: summary.gpa.min !== null ? `/최소 ${summary.gpa.min}` : undefined,
    },
    ...conditionCards,
    ...certCards,
  ];
};
