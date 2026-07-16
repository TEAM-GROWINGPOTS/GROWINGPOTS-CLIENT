'use client';

import { getRequirementInfoContent, hasRequirementInfo, NOTICE_CODES } from '@features/main/constants/requirement';
import type { RequirementAccordionItem } from '@features/main/types/requirement';
import * as Accordion from '@radix-ui/react-accordion';
import type { GraduationCondition } from '@shared/apis/types/graduation';
import { cn } from '@shared/utils/cn';
import type { RefObject } from 'react';

import { RequirementDetail } from './requirement-detail';
import { RequirementHeader } from './requirement-header';

export type { RequirementAccordionItem } from '@features/main/types/requirement';

interface RequirementAccordionProps {
  items: RequirementAccordionItem[];
  defaultValue?: string[];
  itemRefs: RefObject<Record<string, HTMLDivElement | null>>;
  admissionYear?: number;
  className?: string;
}

const getRequirementNotice = ({ code, notice }: RequirementAccordionItem) => {
  if (!NOTICE_CODES.has(code)) return undefined;

  return notice;
};

const getRequirementAccordionValue = ({ code }: GraduationCondition, index: number) => {
  return `${code}-${index}`;
};

export const RequirementAccordion = ({
  items,
  defaultValue = [],
  itemRefs,
  admissionYear,
  className,
}: RequirementAccordionProps) => {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultValue} className={cn('flex flex-col gap-12', className)}>
      {items.map((item, index) => {
        const itemValue = getRequirementAccordionValue(item, index);
        const scrollKey = item.scrollKey ?? itemValue;

        return (
          <Accordion.Item
            key={itemValue}
            ref={(element: HTMLDivElement | null) => {
              itemRefs.current[scrollKey] = element;
            }}
            value={itemValue}
            className="rounded-lg bg-gray-50 p-16"
          >
            <RequirementHeader
              item={item}
              hasInfo={hasRequirementInfo(item.code, admissionYear)}
              infoContent={getRequirementInfoContent(item.code, admissionYear)}
            />
            <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
              <RequirementDetail
                requirementName={item.name}
                notice={getRequirementNotice(item)}
                unmetDescriptions={item.detail?.unmetDescriptions}
                distAreaDescriptions={item.detail?.distAreaDescriptions}
                courses={item.detail?.courses}
                hasRequiredList={item.detail?.hasRequiredList}
                admissionYear={admissionYear}
              />
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
