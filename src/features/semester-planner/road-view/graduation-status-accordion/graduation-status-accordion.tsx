'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge, Tabs } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

const MAJOR_TABS = [
  { value: 'main', label: '본전공' },
  { value: 'double', label: '복수전공' },
];

interface GraduationStatusAccordionProps {
  hasDoubleMajor?: boolean;
}

export const GraduationStatusAccordion = ({ hasDoubleMajor = false }: GraduationStatusAccordionProps) => {
  const [selectedMajor, setSelectedMajor] = useState<'main' | 'double'>('main');

  const mainMajor = useGraduationStatusStore((state) => state.mainMajor);
  const doubleMajor = useGraduationStatusStore((state) => state.doubleMajor);

  if (!mainMajor) return null;

  const { summary, overallMet } = mainMajor;
  const shortfall = summary.totalCredits.required - summary.totalCredits.current;

  const nonMajorConditions = mainMajor.conditions.filter((c) => !c.code.startsWith('MAJOR'));
  const majorConditions =
    hasDoubleMajor && selectedMajor === 'double'
      ? (doubleMajor?.conditions ?? [])
      : mainMajor.conditions.filter((c) => c.code.startsWith('MAJOR'));

  const conditions = [...majorConditions, ...nonMajorConditions];

  return (
    <Accordion.Root type="single" collapsible className="w-306 rounded-xl bg-gray-800">
      <Accordion.Item value="graduation-status">
        <Accordion.Trigger className="group flex w-full items-center justify-between px-24 py-24 data-[state=open]:pb-8">
          <div className="flex items-center gap-8">
            <span className="text-title-sb-18 text-gray-50">졸업 요건 충족 현황</span>
            <Badge size="xsmall" variant="primary" color={overallMet ? 'lime01' : 'darkRed'}>
              {overallMet ? '요건 충족' : `${shortfall}학점 부족`}
            </Badge>
          </div>
          <Icon
            name="ic_chevron_down"
            size={24}
            className="shrink-0 text-gray-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>

        <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          {hasDoubleMajor && (
            <div className="px-24 pt-8">
              <Tabs
                color="white"
                items={MAJOR_TABS}
                value={selectedMajor}
                onChange={(v) => setSelectedMajor(v as 'main' | 'double')}
              />
            </div>
          )}
          <ul className="flex flex-col gap-16 px-24 pt-12 pb-24">
            <li className="flex items-center justify-between">
              <span className="text-body-m-16 text-gray-100">전체</span>
              <div className="flex items-end">
                <span className="text-body-sb-16 text-gray-100">{summary.totalCredits.current}</span>
                <span className="text-body-r-16 text-gray-400">/{summary.totalCredits.required}학점</span>
              </div>
            </li>
            {conditions.map((condition) => (
              <li key={condition.code} className="flex items-center justify-between">
                <span className="text-body-m-16 text-gray-100">{condition.name}</span>
                <div className="flex items-end">
                  <span className={cn('text-body-sb-16', condition.satisfied ? 'text-lime-500' : 'text-gray-100')}>
                    {condition.current}
                  </span>
                  {condition.required !== null ? (
                    <span className="text-body-r-16 text-gray-400">/{condition.required}학점</span>
                  ) : (
                    <span className="text-body-r-16 text-gray-400">학점</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
