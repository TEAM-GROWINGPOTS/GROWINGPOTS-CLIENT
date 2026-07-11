import type { RequirementAccordionItem, RequirementDetail } from '@features/main/types/requirement';
import type { GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';
import { useState } from 'react';

import { useMergedRequirementItems } from './use-merged-requirement-items';
import { type RequirementSectionOption, useRequirementTabs } from './use-requirement-tabs';

const ALL_ITEM_ORDER = [
  'GRADUATION_REQUIRED',
  'MAJOR_BASIC',
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'REQUIRED_GE',
  'DISTRIBUTED_GE',
  'FREE_GE',
  'ENGLISH_COURSE',
  'SW_CERT_COURSE',
  'GENERAL_ELECTIVE',
];

interface UseRequirementSectionParams {
  data: GraduationResponse | null;
  details: RequirementDetail[];
}

const getRequirementScrollKey = ({ code, majorName }: Pick<RequirementAccordionItem, 'code' | 'majorName'>) => {
  return `${majorName ?? 'common'}-${code}`;
};

const getRequirementDetail = (item: RequirementAccordionItem, details: RequirementDetail[]) => {
  const detail = details.find(({ conditionCode }) => conditionCode === item.code);
  const major = detail?.majors.find(({ departmentName }) => departmentName === item.majorName) ?? detail?.majors[0];

  return {
    hasRequiredList: major?.hasRequiredList ?? false,
    unmetDescriptions: major?.unmetDescriptions ?? [],
    distAreaDescriptions: major?.distAreaDescriptions ?? [],
    courses: major?.courses ?? [],
  };
};

const getConditionItem = (
  condition: GraduationCondition,
  details: RequirementDetail[],
  majorName?: string | null,
): RequirementAccordionItem => {
  const item = {
    ...condition,
    majorName,
    scrollKey: getRequirementScrollKey({ code: condition.code, majorName }),
  };

  return {
    ...item,
    detail: getRequirementDetail(item, details),
  };
};

const getConditionItems = (
  conditions: GraduationCondition[],
  details: RequirementDetail[],
  majorName?: string | null,
) => {
  return conditions.map((condition) => getConditionItem(condition, details, majorName));
};

const getGraduationRequiredItem = (
  section: RequirementSectionOption['sections'][number],
  details: RequirementDetail[],
): RequirementAccordionItem | null => {
  if (!section.graduationRequired) return null;

  const item = {
    code: 'GRADUATION_REQUIRED',
    name: '졸업 필수',
    current: section.graduationRequired.totalCredit,
    required: null,
    unit: 'CREDITS',
    satisfied: section.graduationRequired.satisfied,
    chartTarget: false,
    majorName: section.majorName,
    scrollKey: getRequirementScrollKey({ code: 'GRADUATION_REQUIRED', majorName: section.majorName }),
  } satisfies Omit<RequirementAccordionItem, 'detail'>;

  return {
    ...item,
    detail: {
      ...getRequirementDetail(item, details),
      unmetDescriptions: section.graduationRequired.unmetDescriptions,
    },
  };
};

const getSectionItems = (
  section: RequirementSectionOption['sections'][number],
  details: RequirementDetail[],
): RequirementAccordionItem[] => {
  const graduationRequiredItem = getGraduationRequiredItem(section, details);
  const sectionItems = getConditionItems(section.conditions, details, section.majorName);

  return graduationRequiredItem ? [graduationRequiredItem, ...sectionItems] : sectionItems;
};

const sortAllItemsByRequirementCode = (items: RequirementAccordionItem[]) => {
  return [...items].sort((firstItem, secondItem) => {
    const firstOrder = ALL_ITEM_ORDER.indexOf(firstItem.code);
    const secondOrder = ALL_ITEM_ORDER.indexOf(secondItem.code);

    if (firstOrder === -1 && secondOrder === -1) return 0;
    if (firstOrder === -1) return 1;
    if (secondOrder === -1) return -1;

    return firstOrder - secondOrder;
  });
};

const getRequirementItems = (
  { sections }: RequirementSectionOption,
  details: RequirementDetail[],
): RequirementAccordionItem[] => {
  return sections.flatMap((section) => getSectionItems(section, details));
};

const getRequirementShortcuts = (items: RequirementAccordionItem[]) => {
  const shortcuts = new Map<string, RequirementAccordionItem>();

  items.forEach((item) => {
    if (shortcuts.has(item.code)) return;
    shortcuts.set(item.code, item);
  });

  return Array.from(shortcuts.values());
};

export const useRequirementSection = ({ data, details }: UseRequirementSectionParams) => {
  const { tabs, selectedTab, setSelectedTab, selectedSectionOption } = useRequirementTabs(data);
  const [scrollTargetKey, setScrollTargetKey] = useState<string | null>(null);
  const rawItems = selectedSectionOption ? getRequirementItems(selectedSectionOption, details) : [];
  const mergedItems = useMergedRequirementItems(rawItems, Boolean(selectedSectionOption?.shouldSort));
  const items = selectedSectionOption?.shouldSort ? sortAllItemsByRequirementCode(mergedItems) : mergedItems;
  const shortcuts = getRequirementShortcuts(items);

  const handleShortcutClick = (scrollKey?: string) => {
    if (!scrollKey) return;

    setScrollTargetKey(null);
    requestAnimationFrame(() => setScrollTargetKey(scrollKey));
  };

  return {
    tabs,
    selectedTab,
    setSelectedTab,
    shortcuts,
    items,
    scrollTargetKey,
    handleShortcutClick,
  };
};
