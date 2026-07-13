'use client';

import { IconButton } from '@shared/components/icon-button/icon-button';
import { Tooltip } from '@shared/components/tooltip/tooltip';
import { Handle, Position } from '@xyflow/react';

export const AddSemesterNode = () => {
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Tooltip
        trigger={<IconButton icon="ic_plus" size="medium" aria-label="학기 추가" className="nodrag" />}
        content="학기 추가"
        variant="top-center"
      />
    </>
  );
};
