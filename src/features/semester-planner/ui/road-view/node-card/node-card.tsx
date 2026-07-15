'use client';

import type { NodeCardCourse } from '@features/semester-planner/types/planner-node';
import { FolderItemMenu } from '@features/semester-planner/ui/card-view';
import * as Accordion from '@radix-ui/react-accordion';
import { Badge, ConfirmModal } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

import { CourseItem } from './course-item';

export type { NodeCardCourse };

export type NodeCardStatusTypes = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

type BaseNodeCardProps = {
  isSelected: boolean;
  termName: string;
  folderName: string;
  totalCredit: number;
  courses: NodeCardCourse[];
  className?: string;
};

export type NodeCardProps =
  | (BaseNodeCardProps & {
      status: 'PLANNED';
      onDelete: () => void;
      isMenuVisible?: boolean;
      /** 같은 학기에 남은 버전이 이것뿐이면 true — 삭제 확인 모달 문구가 달라진다. */
      isLastVersion?: boolean;
    })
  | (BaseNodeCardProps & { status: 'COMPLETED' | 'IN_PROGRESS' });

const STATUS_ICON: Record<'COMPLETED' | 'IN_PROGRESS', string> = {
  COMPLETED: 'ic_check_circle_black',
  IN_PROGRESS: 'ic_check_circle_lime',
};

function getCreditBadgeText(status: NodeCardStatusTypes, totalCredit: number): string {
  if (status === 'COMPLETED') return `${totalCredit}학점 이수완료`;
  if (status === 'IN_PROGRESS') return `${totalCredit}학점 이수 중`;
  return `${totalCredit}학점 이수예정`;
}

export const NodeCard = (props: NodeCardProps) => {
  const { status, isSelected, termName, folderName, totalCredit, courses, className } = props;
  const isLime = status !== 'PLANNED' || isSelected;
  const [defaultOpen] = useState(isLime);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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
          <FolderItemMenu onDelete={() => setIsDeleteConfirmOpen(true)} alwaysVisible={props.isMenuVisible} />
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
          <Accordion.Content className="overflow-hidden">
            <div className="mt-12 h-px bg-gray-100" />
            <div className="mt-12 flex flex-col gap-8">
              {courses.length > 0 ? (
                courses.map((course) => <CourseItem key={course.id} course={course} />)
              ) : (
                <div className="flex h-44 items-center justify-center rounded-md border border-dashed border-gray-300">
                  <span className="text-body-m-14 text-gray-400">과목 없음</span>
                </div>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      {status === 'PLANNED' && (
        <ConfirmModal
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          type="delete"
          title={`${termName}의 '${folderName}'을 삭제할까요?`}
          description={
            props.isLastVersion ? (
              <>
                이 폴더는 마지막 폴더예요.
                <br />
                삭제하면 학기 카드도 함께 삭제되며 복구할 수 없어요.
              </>
            ) : (
              '삭제한 폴더는 복구할 수 없어요.'
            )
          }
          onConfirm={() => {
            setIsDeleteConfirmOpen(false);
            props.onDelete();
          }}
        />
      )}
    </div>
  );
};
