'use client';

import { INFORMATION_CODES, INFORMATION_CONTENTS, NOTICE_CODES } from '@features/main/constants/requirement';
import type { RequirementAccordionItem, RequirementCondition } from '@features/main/types/requirement';
import { RequirementDetail, RequirementHeader } from '@features/main/ui';
import * as Accordion from '@radix-ui/react-accordion';
import { cn } from '@shared/utils/cn';

export type {
  MajorTypes,
  RequirementAccordionItem,
  RequirementCondition,
  RequirementCourse,
  RequirementDetail,
} from '@features/main/types/requirement';

interface RequirementAccordionProps {
  items: RequirementAccordionItem[];
  defaultValue?: string[];
  className?: string;
}

const hasRequirementInfo = ({ code }: RequirementCondition) => INFORMATION_CODES.has(code);

const getRequirementNotice = ({ code, notice }: RequirementAccordionItem) => {
  if (!NOTICE_CODES.has(code)) return undefined;

  return notice;
};

const getRequirementInfoContent = ({ code }: RequirementCondition) => INFORMATION_CONTENTS[code];

const getRequirementAccordionValue = ({ code, majorType }: RequirementCondition) => {
  return `${majorType ?? 'ALL'}-${code}`;
};

export const RequirementAccordion = ({ items, defaultValue, className }: RequirementAccordionProps) => {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultValue} className={cn('flex w-509 flex-col gap-12', className)}>
      {items.map((item) => (
        <Accordion.Item
          key={getRequirementAccordionValue(item)}
          value={getRequirementAccordionValue(item)}
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
              courses={item.detail?.courses}
              hasRequiredList={item.detail?.hasRequiredList}
            />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
