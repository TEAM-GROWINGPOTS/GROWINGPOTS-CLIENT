import type { CertType, GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';

import type { RequirementCardProps, RequirementVariant } from './requirement-card';

type MetricGroup = 'credit' | 'non-credit';

const unitSuffixes: Record<GraduationCondition['unit'], string> = {
  CREDITS: '학점',
  COURSES: '과목',
};

const certResultLabels = {
  PASS: '통과',
  FAIL: '미통과',
  EXEMPT: '면제',
  NONE: '해당 없음',
};

// 학점(CREDITS) 단위는 충족 시 dark, 그 외(평점/인증/과목 수)는 충족 시 highlight. 미충족은 항상 default.
const toVariant = (group: MetricGroup, satisfied: boolean): RequirementVariant => {
  if (!satisfied) return 'default';
  return group === 'credit' ? 'dark' : 'highlight';
};

const mergeConditionsByCode = (conditions: GraduationCondition[]) => {
  const merged = new Map<string, GraduationCondition>();

  conditions.forEach((condition) => {
    const existing = merged.get(condition.code);
    if (!existing) {
      merged.set(condition.code, condition);
      return;
    }

    const current = existing.current + condition.current;
    const required =
      existing.required === null || condition.required === null ? null : existing.required + condition.required;

    merged.set(condition.code, {
      ...existing,
      current,
      required,
      satisfied: required === null ? existing.satisfied : current >= required,
    });
  });

  return merged;
};

const toConditionCard = (condition: GraduationCondition, label: string): RequirementCardProps => {
  const group: MetricGroup = condition.unit === 'CREDITS' ? 'credit' : 'non-credit';

  return {
    label,
    value: `${condition.current}`,
    total: condition.required === null ? undefined : `/${condition.required}${unitSuffixes[condition.unit]}`,
    variant: toVariant(group, condition.satisfied),
  };
};

const toCertCard = (label: string, cert?: { result: keyof typeof certResultLabels }): RequirementCardProps => {
  if (!cert || cert.result === 'NONE') {
    return { label, value: certResultLabels.NONE, variant: 'default', disabled: true };
  }

  const satisfied = cert.result === 'PASS' || cert.result === 'EXEMPT';

  return { label, value: certResultLabels[cert.result], variant: toVariant('non-credit', satisfied) };
};

// 카드 13개의 순서·라벨은 Figma(node-id 4086-40675) 고정 배치와 동일해야 한다.
export const mapGraduationResponseToCards = ({
  summary,
  sections,
  certs,
}: GraduationResponse): RequirementCardProps[] => {
  const majorConditions = sections
    ? mergeConditionsByCode(sections.majors.flatMap((major) => major.conditions))
    : new Map();
  const geConditions = new Map((sections?.ge.conditions ?? []).map((condition) => [condition.code, condition]));
  const certByType = new Map(certs.map((cert) => [cert.certType, cert]));

  const getMajorCard = (code: string, label: string) => {
    const condition = majorConditions.get(code);
    return condition ? toConditionCard(condition, label) : { label, value: '-', variant: 'default' as const };
  };

  const getGeCard = (code: string, label: string) => {
    const condition = geConditions.get(code);
    return condition ? toConditionCard(condition, label) : { label, value: '-', variant: 'default' as const };
  };

  const getCertCard = (certType: CertType, label: string) => toCertCard(label, certByType.get(certType));

  return [
    {
      label: '총 학점',
      value: `${summary.totalCredits.current}`,
      total: `/${summary.totalCredits.required}학점`,
      variant: toVariant('credit', summary.totalCredits.current >= summary.totalCredits.required),
    },
    {
      label: '졸업 평점',
      value: `${summary.gpa.current}`,
      variant: toVariant('non-credit', summary.gpa.min === null || summary.gpa.current >= summary.gpa.min),
    },
    getMajorCard('ENGLISH_COURSE', '영어'),
    getMajorCard('SW_CERT_COURSE', 'SW인증'),
    getMajorCard('MAJOR_BASIC', '전공 기초'),
    getMajorCard('MAJOR_REQUIRED', '전공 필수'),
    getMajorCard('MAJOR_ELECTIVE', '전공 선택'),
    getGeCard('DISTRIBUTED_GE', '배분이수교과'),
    getGeCard('REQUIRED_GE', '필수교과'),
    getGeCard('FREE_GE', '자유이수'),
    getCertCard('GRADUATION_CERT', '졸업능력인증'),
    getCertCard('THESIS', '논문'),
    getCertCard('TOPIK', '한국어능력인증'),
  ];
};
