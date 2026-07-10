'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import * as Accordion from '@radix-ui/react-accordion';
import type { GraduationCondition, GraduationResponse, GraduationUnit } from '@shared/apis/types/graduation';
import { Badge, Chip, Tooltip } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { Fragment, useRef, useState } from 'react';

import { AccordionProgressBar } from './accordion-progress-bar';
import { calculatePercentage } from './calculate-percentage';

const MAJOR_CODES = new Set(['MAJOR_BASIC', 'MAJOR_REQUIRED', 'MAJOR_ELECTIVE']);
const OTHER_REQUIRED_CODE_ORDER = ['SW_CERT_COURSE', 'ENGLISH_COURSE'];
const GE_CODE_ORDER = ['DISTRIBUTED_GE', 'REQUIRED_GE', 'FREE_GE'];
const UNIT_LABEL: Record<GraduationUnit, string> = { CREDITS: '학점', COURSES: '과목' };

interface TabRow {
  key: string;
  name: string;
  current: number;
  required: number | null;
  unit: GraduationUnit;
}

const toTabRows = (conditions: GraduationCondition[]): TabRow[] =>
  conditions.map(({ code, name, current, required, unit }) => ({ key: code, name, current, required, unit }));

const orderConditions = (conditions: GraduationCondition[], order: string[]): GraduationCondition[] =>
  order.flatMap((code) => conditions.filter((c) => c.code === code));

interface GraduationStatusAccordionProps {
  className?: string;
  data?: GraduationResponse;
}

export const GraduationStatusAccordion = ({ className, data: dataProp }: GraduationStatusAccordionProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isArrowNav, setIsArrowNav] = useState(false);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  const storeData = useGraduationStatusStore((s) => s.data);
  const data = dataProp ?? storeData;

  if (!data || !data.sections) return null;

  const { summary, graduatable, sections } = data;
  const { majors, ge, others } = sections;
  const { totalCredits } = summary;

  const mainMajor = majors.find(({ majorType }) => majorType === 'MAIN') ?? majors[0];
  const hasGraduationRequired = mainMajor?.graduationRequired?.hasGraduationRequired ?? false;

  const graduationRequiredRows: TabRow[] = (mainMajor?.graduationRequired?.items ?? []).map(
    ({ name, current, required, unit }) => ({ key: name, name, current, required, unit }),
  );

  const otherRequiredRows: TabRow[] = toTabRows(
    orderConditions(mainMajor?.conditions ?? [], OTHER_REQUIRED_CODE_ORDER),
  );

  const tabs = [
    ...(hasGraduationRequired ? ['졸업 필수'] : []),
    ...majors.map(({ majorName }) => majorName),
    '교양',
    'SW/영어',
  ];

  const getTabConditions = (index: number): TabRow[] => {
    if (hasGraduationRequired && index === 0) return graduationRequiredRows;
    if (index === tabs.length - 1) return otherRequiredRows;
    if (index === tabs.length - 2) return toTabRows(orderConditions(ge.conditions, GE_CODE_ORDER));
    const majorIndex = hasGraduationRequired ? index - 1 : index;
    return toTabRows(majors[majorIndex]?.conditions.filter(({ code }) => MAJOR_CODES.has(code)) ?? []);
  };

  // 전공/교양/기타 학점을 각 섹션에서 합산하여 스택 바에 사용
  const majorCredit =
    majors[0]?.conditions.filter(({ code }) => MAJOR_CODES.has(code)).reduce((sum, { current }) => sum + current, 0) ??
    0;
  const generalCredit = ge.conditions.reduce((sum, { current }) => sum + current, 0);
  const otherCredit = others.conditions.reduce((sum, { current }) => sum + current, 0);

  const toPercent = (current: number) => calculatePercentage(current, totalCredits.required);

  const shortfallCredit = Math.max(totalCredits.required - totalCredits.current, 0);

  const handleChipKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsArrowNav(true);
      const next =
        e.key === 'ArrowRight' ? (activeTabIndex + 1) % tabs.length : (activeTabIndex - 1 + tabs.length) % tabs.length;
      setActiveTabIndex(next);
      const chips = chipContainerRef.current?.querySelectorAll<HTMLButtonElement>('button');
      const target = chips?.[next];
      target?.focus();
      target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } else if (e.key === 'Tab') {
      setIsArrowNav(false);
    }
  };

  return (
    <Accordion.Root type="single" collapsible className={cn('w-full rounded-lg bg-white p-20', className)}>
      <Accordion.Item value="graduation-status">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <p className="text-title-sb-18 text-gray-800">졸업 요건 충족 현황</p>
                <Tooltip
                  trigger={
                    <span className="-ml-6 pl-6" onClick={(e) => e.stopPropagation()}>
                      <Icon name="ic_information_outline" size={20} className="text-gray-300" />
                    </span>
                  }
                  content="과목을 추가/삭제하면 충족 현황이 실시간으로 반영돼요"
                  variant="top-start"
                  size="md"
                />
              </div>
              {!graduatable && <Badge size="xsmall" color="red">{`${shortfallCredit}학점 부족`}</Badge>}
            </div>
            <Icon
              name="ic_chevron_down"
              size={24}
              className="rotate-180 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-0"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          <div className="grid w-full grid-cols-[2fr_3fr] gap-16 pt-12">
            {/* 총 학점 */}
            <div className="flex flex-col justify-between py-12">
              <div className="flex w-full flex-col gap-6">
                <div className="flex w-full items-center justify-between">
                  <span className="text-body-m-14 text-gray-700">총 학점</span>
                  <div className="flex items-end">
                    <span className="text-body-sb-14 text-gray-700">{totalCredits.current}</span>
                    <span className="text-body-r-14 text-gray-400">/{totalCredits.required}학점</span>
                  </div>
                </div>
                <div
                  className="relative h-16 w-full overflow-hidden rounded-xs"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, #f4f4f4 0px, #f4f4f4 3px, #fafafa 3px, #fafafa 6px)',
                  }}
                >
                  <div className="absolute inset-y-0 left-0 flex h-full w-full">
                    <div
                      className="bg-blue-10 animate-progress-fill h-full origin-left"
                      style={{ width: `${toPercent(otherCredit)}%` }}
                    />
                    <div
                      className="bg-purple-10 animate-progress-fill h-full origin-left"
                      style={{ width: `${toPercent(generalCredit)}%`, animationDelay: '600ms' }}
                    />
                    <div
                      className="animate-progress-fill h-full origin-left bg-lime-400"
                      style={{ width: `${toPercent(majorCredit)}%`, animationDelay: '1200ms' }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-8">
                <LegendItem dotClass="bg-lime-400" label="전공" credit={majorCredit} />
                <LegendItem dotClass="bg-purple-10" label="교양" credit={generalCredit} />
                <LegendItem dotClass="bg-blue-10" label="기타" credit={otherCredit} />
              </div>
            </div>

            {/* 탭별 요건 현황 */}
            <div className="flex min-h-158 flex-col gap-16 rounded bg-gray-50 p-16">
              <div
                ref={chipContainerRef}
                role="tablist"
                className="flex h-30 [scrollbar-width:none] gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                onKeyDown={handleChipKeyDown}
              >
                {tabs.map((tab, index) => (
                  <Chip
                    key={tab}
                    role="tab"
                    aria-selected={activeTabIndex === index}
                    label={tab}
                    size="small"
                    isSelected={activeTabIndex === index}
                    tabIndex={activeTabIndex === index ? 0 : -1}
                    className={cn('shrink-0', isArrowNav && 'focus:outline-none')}
                    onClick={() => {
                      setIsArrowNav(false);
                      setActiveTabIndex(index);
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-x-12 gap-y-8 px-4">
                {getTabConditions(activeTabIndex).map(({ key, name, current, required, unit }) => (
                  <Fragment key={key}>
                    <span className="text-body-sb-14 text-gray-800">{name}</span>
                    <AccordionProgressBar current={current} required={required ?? 0} />
                    <div className="flex items-center justify-end">
                      <span className="text-body-sb-14 text-gray-700">{current}</span>
                      <span className="text-body-r-14 text-gray-400">
                        /{required ?? '-'}
                        {UNIT_LABEL[unit]}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

interface LegendItemProps {
  dotClass: string;
  label: string;
  credit: number;
}

const LegendItem = ({ dotClass, label, credit }: LegendItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={cn('size-12 rounded-full', dotClass)} />
      <span className="text-body-m-14 text-gray-600">{label}</span>
    </div>
    <span className="text-body-m-14 text-gray-700">{credit}학점</span>
  </div>
);
