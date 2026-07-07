'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Badge } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

interface GraduationStatusAccordionProps {
  shortfallCredit: number;
  children: ReactNode;
  className?: string;
}

export const GraduationStatusAccordion = ({ shortfallCredit, children, className }: GraduationStatusAccordionProps) => {
  return (
    <Accordion.Root type="single" collapsible className={cn('w-full rounded-[8px] bg-white p-20', className)}>
      <Accordion.Item value="graduation-status">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <p className="text-title-sb-18 text-gray-800">졸업 요건 충족 현황</p>
                <Icon name="ic_information_outline" size={20} className="text-gray-300" />
              </div>
              <Badge size="xsmall" color="red">{`${shortfallCredit}학점 부족`}</Badge>
            </div>
            <Icon
              name="ic_chevron_down"
              size={24}
              className="rotate-180 text-gray-800 transition-transform duration-200 group-data-[state=open]:rotate-0"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          forceMount
          className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
        >
          <div className="overflow-hidden">
            <div className="pt-16">{children}</div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
