'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Badge } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

import { CourseItem } from './course-item';

export interface NodeCardCourse {
  id: number;
  courseName: string;
  divisionCategory: string | null;
  divisionName: string | null;
}

export type NodeCardStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

export interface NodeCardProps {
  status: NodeCardStatus;
  /* true → 라임 카드 & 아코디언 초기 오픈. completedTerms는 항상 true. */
  isSelected: boolean;
  /* 헤더에 표시되는 학기명 (예: "1학년 1학기") */
  termName: string;
  /* 아코디언 헤더에 표시되는 폴더/버전명 */
  folderName: string;
  /* 학기 총 이수학점 → 배지 표기 */
  totalCredit: number;
  /* 학기 내 수강 과목 리스트 */
  courses: NodeCardCourse[];
  /* PLANNED 카드의 점세개 버튼 클릭 핸들러 */
  onMenuClick?: () => void;
  className?: string;
}

const STATUS_ICON: Record<'COMPLETED' | 'IN_PROGRESS', string> = {
  COMPLETED: 'ic_check_circle_black',
  IN_PROGRESS: 'ic_check_circle_lime',
};

function getCreditBadgeText(status: NodeCardStatus, totalCredit: number): string {
  if (status === 'COMPLETED') return `${totalCredit}학점 이수완료`;
  if (status === 'IN_PROGRESS') return `${totalCredit}학점 이수 중`;
  return `${totalCredit}학점 이수예정`;
}

export const NodeCard = ({
  status,
  isSelected,
  termName,
  folderName,
  totalCredit,
  courses,
  onMenuClick,
  className,
}: NodeCardProps) => {
  // status가 PLANNED이거나 isSelected가 false인 경우 → 아코디언 닫힘, 그 외 → 아코디언 열림
  const isLime = status !== 'PLANNED' || isSelected;
  // 노드뷰 진입 시 초기값만 사용 — isSelected 변경 시 아코디언 상태 자동 조정 안 함
  const [defaultOpen] = useState(isLime);

  return (
    <div
      className={cn(
        'flex w-250 flex-col gap-12 self-start overflow-hidden rounded-xl px-8 pt-16 pb-8',
        isLime ? 'border border-lime-300 bg-lime-300' : 'bg-gray-50',
        className,
      )}
    >
      {/* 카드 헤더 */}
      <div className={cn('flex shrink-0 items-center justify-between', status === 'PLANNED' ? 'pr-2 pl-8' : 'px-8')}>
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <div className="flex shrink-0 items-center gap-4">
            {(status === 'COMPLETED' || status === 'IN_PROGRESS') && (
              <Icon name={STATUS_ICON[status]} size={20} className="shrink-0" />
            )}
            <span className={cn('text-title-sb-18', isLime ? 'text-gray-800' : 'text-gray-700')}>{termName}</span>
          </div>
          <Badge
            size="xsmall"
            variant={isLime ? 'primary' : 'disabled'}
            color={isLime ? 'lime02' : undefined}
            className={cn('shrink-0', !isLime && 'bg-gray-200')}
          >
            {getCreditBadgeText(status, totalCredit)}
          </Badge>
        </div>

        {status === 'PLANNED' && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="학기 옵션"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-sm p-2"
          >
            <Icon name="ic_dot_vertical" size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* 아코디언 (학기 카드) */}
      <Accordion.Root type="single" collapsible defaultValue={defaultOpen ? 'term' : undefined} className="w-full">
        <Accordion.Item value="term" className="rounded-lg bg-white p-8">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between px-4 py-4">
              <span className={cn('text-body-m-16', isLime ? 'text-gray-900' : 'text-gray-700')}>{folderName}</span>
              <Icon
                name="ic_chevron_down"
                size={20}
                className="shrink-0 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <div className="mt-12 h-px bg-gray-100" />
            <div className="mt-12 flex flex-col gap-8">
              {courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};
