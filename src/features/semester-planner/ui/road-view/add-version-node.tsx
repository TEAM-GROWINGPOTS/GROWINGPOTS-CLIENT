'use client';

import { IconButton } from '@shared/components/icon-button/icon-button';
import { Tooltip } from '@shared/components/tooltip/tooltip';

export const AddVersionNode = () => {
  return (
    <div className="nodrag flex w-250 items-center justify-center">
      <Tooltip
        trigger={<IconButton icon="ic_plus" size="medium" aria-label="학기 폴더 추가" />}
        content="학기 폴더 추가"
        variant="top-center"
      />
    </div>
  );
};
