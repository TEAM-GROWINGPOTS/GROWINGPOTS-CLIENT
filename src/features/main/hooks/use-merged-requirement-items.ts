import type { RequirementAccordionItem, RequirementCourse } from '@features/main/types/requirement';
import { useMemo } from 'react';

const ALL_TAB_MERGED_CODES = new Set(['ENGLISH_COURSE', 'SW_CERT_COURSE']);

const getCourseKey = ({ departmentName, name, semester, studentCourseId }: RequirementCourse) => {
  return studentCourseId ?? `${departmentName}-${name}-${semester}`;
};

const getUniqueCourses = (courses: RequirementCourse[]) => {
  const courseMap = new Map<string | number, RequirementCourse>();

  courses.forEach((course) => {
    courseMap.set(getCourseKey(course), course);
  });

  return Array.from(courseMap.values());
};

const getUniqueDescriptions = (descriptions: string[]) => {
  return Array.from(new Set(descriptions));
};

const getMergedSatisfied = (current: number, required: number | null, items: RequirementAccordionItem[]) => {
  if (required === null) return items.every(({ satisfied }) => satisfied);

  return current >= required;
};

const mergeRequirementItems = (items: RequirementAccordionItem[]) => {
  const [firstItem] = items;
  const current = items.reduce((sum, { current }) => sum + current, 0);
  const required = firstItem.required;

  return {
    ...firstItem,
    current,
    required,
    satisfied: getMergedSatisfied(current, required, items),
    majorName: null,
    scrollKey: `common-${firstItem.code}`,
    detail: {
      hasRequiredList: items.some(({ detail }) => detail?.hasRequiredList),
      unmetDescriptions: getUniqueDescriptions(items.flatMap(({ detail }) => detail?.unmetDescriptions ?? [])),
      distAreaDescriptions: getUniqueDescriptions(items.flatMap(({ detail }) => detail?.distAreaDescriptions ?? [])),
      courses: getUniqueCourses(items.flatMap(({ detail }) => detail?.courses ?? [])),
    },
  };
};

const mergeRequirementItemsByCode = (items: RequirementAccordionItem[]) => {
  const itemsByCode = new Map<string, RequirementAccordionItem[]>();
  const otherItems: RequirementAccordionItem[] = [];

  items.forEach((item) => {
    if (!ALL_TAB_MERGED_CODES.has(item.code)) {
      otherItems.push(item);
      return;
    }

    itemsByCode.set(item.code, [...(itemsByCode.get(item.code) ?? []), item]);
  });

  const mergedItems = Array.from(itemsByCode.values()).map(mergeRequirementItems);

  return [...otherItems, ...mergedItems];
};

export const useMergedRequirementItems = (items: RequirementAccordionItem[], isMergeEnabled: boolean) => {
  return useMemo(() => {
    if (!isMergeEnabled) return items;

    return mergeRequirementItemsByCode(items);
  }, [items, isMergeEnabled]);
};
