'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import * as Accordion from '@radix-ui/react-accordion';
import type { GraduationUnit } from '@shared/apis/types/graduation';
import { Badge, Tabs } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import type { TabItem } from '@shared/components/tabs/tabs';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

const MAJOR_CODES = new Set(['MAJOR_BASIC', 'MAJOR_REQUIRED', 'MAJOR_ELECTIVE']);

const toUnitLabel = (unit: GraduationUnit) => (unit === 'COURSES' ? '과목' : '학점');

export const GraduationStatusAccordion = () => {
  const [selectedMajorIndex, setSelectedMajorIndex] = useState(0);

  const data = useGraduationStatusStore((state) => state.data);

  if (!data || !data.sections) return null;

  const { summary, graduatable, sections } = data;
  const { majors, ge, others } = sections;

  const hasMultipleMajors = majors.length > 1;
  const selectedMajor = majors[selectedMajorIndex];

  const shortfall = summary.totalCredits.required - summary.totalCredits.current;
  const badgeLabel = graduatable ? '요건 충족' : shortfall > 0 ? `${shortfall}학점 부족` : '요건 미충족';

  const graduationRequiredItems =
    selectedMajor.graduationRequired?.hasGraduationRequired && selectedMajor.graduationRequired.items?.length
      ? selectedMajor.graduationRequired.items
      : [];

  const majorConditions = selectedMajor.conditions.filter(({ code }) => MAJOR_CODES.has(code));

  const tabs: TabItem[] = majors.map(({ majorName }, i) => ({
    value: String(i),
    label: majorName,
  }));

  return (
    <Accordion.Root type="single" collapsible className="w-306 rounded-xl bg-gray-800">
      <Accordion.Item value="graduation-status">
        <Accordion.Header asChild>
          <h3>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-24 py-24 transition-[padding-bottom] duration-200 data-[state=open]:pb-8">
              <div className="flex items-center gap-8">
                <span className="text-title-sb-18 text-gray-100">졸업 요건 충족 현황</span>
                <Badge size="xsmall" variant="primary" color={graduatable ? 'lime01' : 'darkRed'}>
                  {badgeLabel}
                </Badge>
              </div>
              <Icon
                name="ic_chevron_down"
                size={24}
                className="shrink-0 text-gray-100 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </h3>
        </Accordion.Header>

        <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          {hasMultipleMajors && (
            <div className="px-24 pt-8">
              <Tabs
                color="white"
                items={tabs}
                value={String(selectedMajorIndex)}
                onChange={(v) => setSelectedMajorIndex(Number(v))}
              />
            </div>
          )}
          <ul className="flex flex-col gap-16 px-24 pt-12 pb-24">
            <li className="flex items-center justify-between">
              <span className="text-body-m-16 text-gray-100">전체</span>
              <div className="flex items-end">
                <span className={cn('text-body-sb-16', shortfall <= 0 ? 'text-lime-500' : 'text-gray-100')}>
                  {summary.totalCredits.current}
                </span>
                <span className="text-body-r-16 text-gray-400">/{summary.totalCredits.required}학점</span>
              </div>
            </li>
            {graduationRequiredItems.map(({ name, current, required, unit, satisfied }) => (
              <li key={name} className="flex items-center justify-between">
                <span className="text-body-m-16 text-gray-100">{name}</span>
                <div className="flex items-end">
                  <span className={cn('text-body-sb-16', satisfied ? 'text-lime-500' : 'text-gray-100')}>
                    {current}
                  </span>
                  <span className="text-body-r-16 text-gray-400">
                    /{required}
                    {toUnitLabel(unit)}
                  </span>
                </div>
              </li>
            ))}
            {majorConditions.map(({ code, name, current, required, unit, satisfied }) => (
              <li key={code} className="flex items-center justify-between">
                <span className="text-body-m-16 text-gray-100">{name}</span>
                <div className="flex items-end">
                  <span className={cn('text-body-sb-16', satisfied ? 'text-lime-500' : 'text-gray-100')}>
                    {current}
                  </span>
                  {required !== null ? (
                    <span className="text-body-r-16 text-gray-400">
                      /{required}
                      {toUnitLabel(unit)}
                    </span>
                  ) : (
                    <span className="text-body-r-16 text-gray-400">{toUnitLabel(unit)}</span>
                  )}
                </div>
              </li>
            ))}
            {[...ge.conditions, ...others.conditions].map(({ code, name, current, required, unit, satisfied }) => (
              <li key={code} className="flex items-center justify-between">
                <span className="text-body-m-16 text-gray-100">{name}</span>
                <div className="flex items-end">
                  <span className={cn('text-body-sb-16', satisfied ? 'text-lime-500' : 'text-gray-100')}>
                    {current}
                  </span>
                  {required !== null ? (
                    <span className="text-body-r-16 text-gray-400">
                      /{required}
                      {toUnitLabel(unit)}
                    </span>
                  ) : (
                    <span className="text-body-r-16 text-gray-400">{toUnitLabel(unit)}</span>
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
