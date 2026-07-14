'use client';

import { MAX_FOLDERS_PER_TERM } from '@features/semester-planner/constants';
import type { AddVersionNodeType } from '@features/semester-planner/types/planner-graph';
import { IconButton } from '@shared/components/icon-button/icon-button';
import { Tooltip } from '@shared/components/tooltip/tooltip';
import { cn } from '@shared/utils/cn';
import { NodeProps } from '@xyflow/react';

export const AddVersionNode = ({ data }: NodeProps<AddVersionNodeType>) => {
  const isMaxVersions = data.versionCount >= MAX_FOLDERS_PER_TERM;

  return (
    <div className="nodrag flex w-250 items-center justify-center">
      <Tooltip
        trigger={
          <IconButton
            icon="ic_plus"
            size="medium"
            aria-label="학기 폴더 추가"
            disabled={isMaxVersions}
            className={cn(isMaxVersions && 'cursor-not-allowed bg-gray-100 text-gray-300 hover:bg-gray-100')}
          />
        }
        content={isMaxVersions ? '폴더는 최대 5개까지 생성돼요' : '학기 폴더 추가'}
        variant="top-center"
      />
    </div>
  );
};
