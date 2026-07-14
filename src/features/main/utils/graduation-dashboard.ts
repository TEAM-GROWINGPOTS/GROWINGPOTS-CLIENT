import type { GetGraduationParams } from '@features/main/apis/get-graduation';
import { ALL_TAB_VALUE, GE_TAB_VALUE, OTHERS_TAB_VALUE } from '@features/main/constants/requirement';
import type { RequirementAccordionItem, RequirementCode } from '@features/main/types/requirement';
import type { GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';

const SOURCE = 'COMPLETED';
const MAJOR_TAB_PREFIX = 'MAJOR:';
const DASHBOARD_PROGRESS_CODES = [
  'MAJOR_BASIC',
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'REQUIRED_GE',
  'DISTRIBUTED_GE',
  'FREE_GE',
  'SW_CERT_COURSE',
  'ENGLISH_COURSE',
] as const satisfies readonly RequirementCode[];
const MAJOR_TAB_PROGRESS_CODES = new Set<RequirementCode>(['MAJOR_BASIC', 'MAJOR_REQUIRED', 'MAJOR_ELECTIVE']);
const ALL_ONLY_ACCORDION_CODES = new Set<RequirementCode>(['ENGLISH_COURSE', 'SW_CERT_COURSE']);

export const ALL_GRADUATION_PARAMS = {
  majorType: ALL_TAB_VALUE,
  source: SOURCE,
} satisfies GetGraduationParams;

export const getMajorTabValue = (studentMajorId: number) => `${MAJOR_TAB_PREFIX}${studentMajorId}`;

const getStudentMajorIdFromTab = (tabValue: string) => {
  if (!tabValue.startsWith(MAJOR_TAB_PREFIX)) return undefined;

  return Number(tabValue.replace(MAJOR_TAB_PREFIX, ''));
};

export const getGraduationParams = (selectedTab: string): GetGraduationParams => {
  const studentMajorId = getStudentMajorIdFromTab(selectedTab);

  if (studentMajorId !== undefined) {
    return {
      studentMajorId,
      source: SOURCE,
    };
  }

  if (selectedTab === GE_TAB_VALUE || selectedTab === OTHERS_TAB_VALUE) {
    return {
      majorType: selectedTab,
      source: SOURCE,
    };
  }

  return ALL_GRADUATION_PARAMS;
};

export const getGraduationCoursesParams = ({ majorType, studentMajorId }: GetGraduationParams) => ({
  majorType,
  studentMajorId,
});

export const getProgressShortcuts = (
  selectedTab: string,
  allShortcuts: RequirementAccordionItem[],
  selectedShortcuts: RequirementAccordionItem[],
) => {
  if (selectedTab === ALL_TAB_VALUE || selectedTab === GE_TAB_VALUE || selectedTab === OTHERS_TAB_VALUE) {
    return allShortcuts;
  }

  const allShortcutMap = new Map(allShortcuts.map((item) => [item.code as RequirementCode, item]));
  const selectedShortcutMap = new Map(selectedShortcuts.map((item) => [item.code as RequirementCode, item]));

  return DASHBOARD_PROGRESS_CODES.flatMap((code) => {
    const item =
      MAJOR_TAB_PROGRESS_CODES.has(code) && selectedShortcutMap.has(code)
        ? selectedShortcutMap.get(code)
        : allShortcutMap.get(code);

    return item ? [item] : [];
  });
};

export const getVisibleRequirementItems = (selectedTab: string, items: RequirementAccordionItem[]) => {
  if (selectedTab !== ALL_TAB_VALUE) {
    return items.filter(({ code }) => !ALL_ONLY_ACCORDION_CODES.has(code as RequirementCode));
  }

  return items;
};

const getRequirementCodes = (conditions: GraduationCondition[] | null | undefined) => {
  return conditions?.map(({ code }) => code as RequirementCode) ?? [];
};

export const getRequirementDetailCodes = (data: GraduationResponse | null | undefined, selectedTab: string) => {
  if (!data) return [];

  const codes = data.sections
    ? [
        ...data.sections.majors.flatMap(({ conditions }) => getRequirementCodes(conditions)),
        ...getRequirementCodes(data.sections.ge.conditions),
        ...getRequirementCodes(data.sections.others.conditions),
      ]
    : getRequirementCodes(data.conditions);

  if (data.graduationRequired || data.sections?.majors.some(({ graduationRequired }) => graduationRequired)) {
    codes.unshift('GRADUATION_REQUIRED');
  }

  return [...new Set(codes)].filter((code) => selectedTab === ALL_TAB_VALUE || !ALL_ONLY_ACCORDION_CODES.has(code));
};
