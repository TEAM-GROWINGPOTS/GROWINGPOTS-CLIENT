import type { RequirementAccordionItem, RequirementDetail } from '@features/main/types/requirement';
import type { GraduationCondition, GraduationResponse } from '@shared/apis/types/graduation';
import { useMemo, useState } from 'react';

import { useMergedRequirementItems } from './use-merged-requirement-items';

const ALL_ITEM_ORDER = [
  'GRADUATION_REQUIRED',
  'MAJOR_BASIC',
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'REQUIRED_GE',
  'DISTRIBUTED_GE',
  'FREE_GE',
  'SW_CERT_COURSE',
  'ENGLISH_COURSE',
  'GENERAL_ELECTIVE',
];

interface UseRequirementSectionParams {
  data: GraduationResponse | null;
  details: RequirementDetail[];
}

interface RequirementSectionSource {
  majorName: string | null;
  graduationRequired: GraduationResponse['graduationRequired'];
  conditions: GraduationCondition[];
}

interface RequirementSectionOption {
  value: string;
  label: string;
  sections: RequirementSectionSource[];
  shouldSort?: boolean;
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
    name: '졸업필수',
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

const getRequirementSectionOption = (data: GraduationResponse | null): RequirementSectionOption | undefined => {
  if (!data) return undefined;

  if (!data.sections) {
    return {
      value: 'CURRENT',
      label: '현재',
      sections: [
        {
          majorName: null,
          graduationRequired: data.graduationRequired,
          conditions: data.conditions ?? [],
        },
      ],
    };
  }

  return {
    value: 'ALL',
    label: '전체',
    sections: [...data.sections.majors, data.sections.ge, data.sections.others],
    shouldSort: true,
  };
};

const getRequirementShortcuts = (items: RequirementAccordionItem[]) => {
  const shortcuts = new Map<string, RequirementAccordionItem>();

  items.forEach((item) => {
    if (!item.chartTarget) return;

    const shortcut = shortcuts.get(item.code);

    if (!shortcut) {
      shortcuts.set(item.code, item);
      return;
    }

    const current = shortcut.current + item.current;
    const required =
      shortcut.required === null && item.required === null ? null : (shortcut.required ?? 0) + (item.required ?? 0);

    shortcuts.set(item.code, {
      ...shortcut,
      current,
      required,
      satisfied: required === null ? shortcut.satisfied && item.satisfied : current >= required,
    });
  });

  return Array.from(shortcuts.values());
};

export const useRequirementSection = ({ data, details }: UseRequirementSectionParams) => {
  const [scrollTargetKey, setScrollTargetKey] = useState<string | null>(null);
  const selectedSectionOption = useMemo(() => getRequirementSectionOption(data), [data]);
  const rawItems = useMemo(
    () => (selectedSectionOption ? getRequirementItems(selectedSectionOption, details) : []),
    [details, selectedSectionOption],
  );
  const mergedItems = useMergedRequirementItems(rawItems, Boolean(selectedSectionOption?.shouldSort));
  const items = useMemo(
    () => (selectedSectionOption?.shouldSort ? sortAllItemsByRequirementCode(mergedItems) : mergedItems),
    [mergedItems, selectedSectionOption?.shouldSort],
  );
  const shortcuts = useMemo(() => getRequirementShortcuts(items), [items]);

  const handleShortcutClick = (scrollKey?: string) => {
    if (!scrollKey) return;

    setScrollTargetKey(null);
    requestAnimationFrame(() => setScrollTargetKey(scrollKey));
  };

  return {
    shortcuts,
    items,
    scrollTargetKey,
    handleShortcutClick,
  };
};
