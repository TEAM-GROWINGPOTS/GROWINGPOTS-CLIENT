'use client';

import { FolderItemMenu } from '@features/semester-planner/card-view';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

import type { NodeCardCourse } from '../../types/planner-node';
import { CourseItem } from './course-item';

export type { NodeCardCourse };

export type NodeCardStatusTypes = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

export interface NodeCardProps {
  status: NodeCardStatusTypes;
  isSelected: boolean;
  termName: string;
  folderName: string;
  totalCredit: number;
  courses: NodeCardCourse[];
  onDelete?: () => void;
  className?: string;
}

const STATUS_ICON: Record<'COMPLETED' | 'IN_PROGRESS', string> = {
  COMPLETED: 'ic_check_circle_black',
  IN_PROGRESS: 'ic_check_circle_lime',
};

function getCreditBadgeText(status: NodeCardStatusTypes, totalCredit: number): string {
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
  onDelete,
  className,
}: NodeCardProps) => {
  const isLime = status !== 'PLANNED' || isSelected;
  const [defaultOpen] = useState(isLime);

  return (
    <div
      className={cn(
        'group flex w-250 flex-col gap-12 self-start rounded-xl px-8 pt-16 pb-8',
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
          <div className="[&_button]:visible">
            <FolderItemMenu onDelete={onDelete ?? (() => {})} />
          </div>
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
