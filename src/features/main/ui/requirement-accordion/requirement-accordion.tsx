'use client';

import { INFORMATION_CODES, INFORMATION_CONTENTS, NOTICE_CODES } from '@features/main/constants/requirement';
import type { RequirementCourse } from '@features/main/types/requirement';
import * as Accordion from '@radix-ui/react-accordion';
import type { GraduationCondition } from '@shared/apis/types/graduation';
import { cn } from '@shared/utils/cn';

import { RequirementDetail } from './requirement-detail';
import { RequirementHeader } from './requirement-header';

export interface RequirementAccordionItem extends GraduationCondition {
  majorName?: string | null;
  detail?: {
    hasRequiredList: boolean;
    unmetDescriptions: string[];
    distAreaDescriptions: string[];
    courses: RequirementCourse[];
  };
  notice?: string;
}

interface RequirementAccordionProps {
  items: RequirementAccordionItem[];
  defaultValue?: string[];
  className?: string;
}

const hasRequirementInfo = ({ code }: GraduationCondition) => INFORMATION_CODES.has(code);

const getRequirementNotice = ({ code, notice }: RequirementAccordionItem) => {
  if (!NOTICE_CODES.has(code)) return undefined;

  return notice;
};

const getRequirementInfoContent = ({ code }: GraduationCondition) => INFORMATION_CONTENTS[code];

const getRequirementAccordionValue = ({ code }: GraduationCondition, index: number) => {
  return `${code}-${index}`;
};

export const RequirementAccordion = ({ items, defaultValue = [], className }: RequirementAccordionProps) => {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultValue} className={cn('flex w-509 flex-col gap-12', className)}>
      {items.map((item, index) => (
        <Accordion.Item
          key={getRequirementAccordionValue(item, index)}
          value={getRequirementAccordionValue(item, index)}
          className="rounded-lg bg-gray-50 px-20 pt-12 pb-16"
        >
          <RequirementHeader
            item={item}
            hasInfo={hasRequirementInfo(item)}
            infoContent={getRequirementInfoContent(item)}
          />
          <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <RequirementDetail
              requirementName={item.name}
              notice={getRequirementNotice(item)}
              unmetDescriptions={item.detail?.unmetDescriptions}
              distAreaDescriptions={item.detail?.distAreaDescriptions}
              courses={item.detail?.courses}
              hasRequiredList={item.detail?.hasRequiredList}
            />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
