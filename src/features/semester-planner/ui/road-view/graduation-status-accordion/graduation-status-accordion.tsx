'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import { getOtherRequiredConditions } from '@features/semester-planner/utils/graduation-conditions';
import * as Accordion from '@radix-ui/react-accordion';
import type { GraduationResponse, GraduationUnit } from '@shared/apis/types/graduation';
import { Badge, Tabs } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import type { TabItem } from '@shared/components/tabs/tabs';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

const MAJOR_CODES = new Set(['MAJOR_BASIC', 'MAJOR_REQUIRED', 'MAJOR_ELECTIVE']);

const toUnitLabel = (unit: GraduationUnit) => (unit === 'COURSES' ? '과목' : '학점');

interface GraduationStatusAccordionProps {
  className?: string;
  data?: GraduationResponse;
}

export const GraduationStatusAccordion = ({ className, data: dataProp }: GraduationStatusAccordionProps) => {
  const [selectedMajorIndex, setSelectedMajorIndex] = useState(0);

  const storeData = useGraduationStatusStore((state) => state.data);
  const data = dataProp ?? storeData;

  if (!data || !data.sections) return null;

  const { summary, sections } = data;
  const { majors, ge, others } = sections;

  const hasMultipleMajors = majors.length > 1;
  const selectedMajor = majors[selectedMajorIndex];

  // 비학점 요건(SW/영어 등)과 무관하게, 학점 요건만 충족하면 "요건 충족"으로 표시한다.
  const shortfall = summary.totalCredits.required - summary.totalCredits.current;
  const isCreditFulfilled = shortfall <= 0;
  const badgeLabel = isCreditFulfilled ? '학점 요건 충족' : `${shortfall}학점 부족`;

  const graduationRequiredItems =
    selectedMajor.graduationRequired?.hasGraduationRequired && selectedMajor.graduationRequired.items?.length
      ? selectedMajor.graduationRequired.items
      : [];

  const majorConditions = selectedMajor.conditions.filter(({ code }) => MAJOR_CODES.has(code));

  // SW/영어는 전공·교양·기타 섹션에 나뉘어 내려오므로 getOtherRequiredConditions로 합산해 모든 탭에서 동일하게 보여준다.
  const otherRequiredConditions = getOtherRequiredConditions(sections);
  const otherRequiredCodes = new Set(otherRequiredConditions.map(({ code }) => code));

  const geConditions = ge.conditions.filter(({ code }) => !otherRequiredCodes.has(code));
  // others.conditions는 GENERAL_ELECTIVE 하나만 내려오는 게 서버 계약이라(배열인 건 다른 섹션과의
  // 구조 통일용) SW/영어 코드와 섞일 일이 없어 별도 필터 없이 그대로 쓴다.
  const otherConditions = others.conditions;

  const tabs: TabItem[] = majors.map(({ majorName }, i) => ({
    value: String(i),
    label: majorName,
  }));

  return (
    <Accordion.Root type="single" collapsible className={cn('w-306 rounded-xl bg-gray-800', className)}>
      <Accordion.Item value="graduation-status">
        <Accordion.Header asChild>
          <h3>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between px-24 py-24 transition-[padding-bottom] duration-200 data-[state=open]:pb-8">
              <div className="flex items-center gap-8">
                <span className="text-title-sb-18 text-gray-100">졸업 학점 충족 현황</span>
                <Badge size="xsmall" variant="primary" color={isCreditFulfilled ? 'lime01' : 'darkRed'}>
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
            {geConditions.map(({ code, name, current, required, unit, satisfied }) => (
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
            {otherRequiredConditions.map(({ code, current, required, unit }) => {
              const satisfied = required === null || current >= required;
              return (
                <li key={code} className="flex items-center justify-between">
                  <span className="text-body-m-16 text-gray-100">일반 선택</span>
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
              );
            })}
            {otherConditions.map(({ code, name, current, required, unit, satisfied }) => (
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
