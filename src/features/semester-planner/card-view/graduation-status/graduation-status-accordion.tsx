'use client';

import { useGraduationStatusStore } from '@features/semester-planner/store/graduation-status-store';
import type { GraduationCondition } from '@features/semester-planner/types/graduation-status';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge, Chip, Tooltip } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { Fragment, useState } from 'react';

import { AccordionProgressBar } from './accordion-progress-bar';

type GraduationTab = '본전공' | '다전공' | '교양';

const TABS: GraduationTab[] = ['본전공', '다전공', '교양'];

interface GraduationStatusAccordionProps {
  className?: string;
}

export const GraduationStatusAccordion = ({ className }: GraduationStatusAccordionProps) => {
  const [activeTab, setActiveTab] = useState<GraduationTab>('본전공');
  const { mainMajor, doubleMajor } = useGraduationStatusStore();

  if (!mainMajor) return null;

  const { summary, conditions, overallMet } = mainMajor;
  const { totalCredits } = summary;

  const majorConditions = conditions.filter((c) => c.code.startsWith('MAJOR') && c.code !== 'MAJOR');
  const nonMajorConditions = conditions.filter(
    (c) => !c.code.startsWith('MAJOR') && c.code !== 'GENERAL' && c.code !== 'OTHER',
  );
  const doubleMajorConditions =
    doubleMajor?.conditions.filter((c) => c.code.startsWith('MAJOR') && c.code !== 'MAJOR') ?? [];

  const tabConditions: Record<GraduationTab, GraduationCondition[]> = {
    본전공: majorConditions,
    다전공: doubleMajorConditions,
    교양: nonMajorConditions,
  };

  const majorCredit = conditions.find((c) => c.code === 'MAJOR')?.current ?? 0;
  const generalCredit = conditions.find((c) => c.code === 'GENERAL')?.current ?? 0;
  const otherCredit = conditions.find((c) => c.code === 'OTHER')?.current ?? 0;

  const toPercent = (current: number) =>
    totalCredits.required > 0 ? Math.min((current / totalCredits.required) * 100, 100) : 0;

  const shortfallCredit = Math.max(totalCredits.required - totalCredits.current, 0);

  return (
    <Accordion.Root type="single" collapsible className={cn('w-full rounded-[8px] bg-white p-20', className)}>
      <Accordion.Item value="graduation-status">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <p className="text-title-sb-18 text-gray-800">졸업 요건 충족 현황</p>
                <Tooltip
                  trigger={
                    <span className="-ml-6 pl-6">
                      <Icon name="ic_information_outline" size={20} className="text-gray-300" />
                    </span>
                  }
                  content="과목을 추가/삭제하면 충족 현황이 실시간으로 반영돼요"
                  variant="top-start"
                  size="md"
                />
              </div>
              {!overallMet && <Badge size="xsmall" color="red">{`${shortfallCredit}학점 부족`}</Badge>}
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
                  className="relative h-16 w-full overflow-hidden rounded-[2px]"
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
            <div className="flex h-158 flex-col justify-between rounded bg-gray-50 p-16">
              <div className="flex gap-8">
                {TABS.map((tab) => (
                  <Chip
                    key={tab}
                    label={tab}
                    size="small"
                    isSelected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-x-12 gap-y-8 px-4">
                {tabConditions[activeTab].map(({ code, name, current, required }) => (
                  <Fragment key={code}>
                    <span className="text-body-sb-14 text-gray-800">{name}</span>
                    <AccordionProgressBar current={current} required={required ?? 0} />
                    <div className="flex w-70 items-center justify-end">
                      <span className="text-body-sb-14 text-gray-700">{current}</span>
                      <span className="text-body-r-14 text-gray-400">/{required ?? '-'}학점</span>
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
