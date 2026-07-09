'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import type { GraduationUnit } from '@features/semester-planner/types/graduation-status';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge, Tabs } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import type { TabItem } from '@shared/components/tabs/tabs';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

// SW/영어 강의가 교양과 전공에 중복으로 들어가 있음 -> 전공 요건에서는 제외하고 교양 요건에서만 보여주기 위해 전공 요건 코드 정의
const MAJOR_CODES = new Set(['MAJOR_BASIC', 'MAJOR_REQUIRED', 'MAJOR_ELECTIVE']);

// 학점 단위와 과목 단위를 한글로 변환
const toUnitLabel = (unit: GraduationUnit) => (unit === 'COURSES' ? '과목' : '학점');

export const GraduationStatusAccordion = () => {
  const [selectedMajorIndex, setSelectedMajorIndex] = useState(0);

  const data = useGraduationStatusStore((state) => state.data);

  if (!data) return null;

  // 졸업 요건 데이터 구조 분해 할당
  const { summary, graduatable, sections } = data; // 졸업 요건 요약, 졸업 가능 여부, 졸업 요건 섹션(전공 목록, 교양, 기타)
  const { majors, ge, others } = sections; // 전공 목록(MAIN + DOUBLE), 교양, 기타 섹션

  // 다전공 여부 확인 (본전공 외 다전공이 하나 이상인 경우)
  const hasMultipleMajors = majors.length > 1;
  // 선택된 전공 섹션 결정
  const selectedMajor = majors[selectedMajorIndex];

  // 몇 학점 부족한지 계산
  const shortfall = summary.totalCredits.required - summary.totalCredits.current;
  // 졸업 요건 충족 여부에 따라 배지 라벨 결정
  // 학점 부족인 경우 `${shortfall}학점 부족`, 졸업 요건 충족인 경우 '요건 충족', 그 외에는 '요건 미충족'으로 표시
  const badgeLabel = graduatable ? '요건 충족' : shortfall > 0 ? `${shortfall}학점 부족` : '요건 미충족';

  // 졸업 필수 요건이 있는 경우 해당 항목들을 배열로 추출, 없으면 빈 배열 반환
  const graduationRequiredItems =
    selectedMajor.graduationRequired?.hasGraduationRequired && selectedMajor.graduationRequired.items?.length
      ? selectedMajor.graduationRequired.items
      : [];

  // 전공 섹션의 조건 중 전공 요건 코드에 해당하는 항목만 필터링
  const majorConditions = selectedMajor.conditions.filter(({ code }) => MAJOR_CODES.has(code));

  // 탭 항목 구성: 모든 전공(MAIN + DOUBLE)을 순서대로 표시
  const tabs: TabItem[] = majors.map(({ majorName }, i) => ({
    value: String(i),
    label: majorName,
  }));

  return (
    <Accordion.Root type="single" collapsible className="w-306 rounded-xl bg-gray-800">
      <Accordion.Item value="graduation-status">
        <Accordion.Trigger className="group flex w-full items-center justify-between px-24 py-24 data-[state=open]:pb-8">
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
