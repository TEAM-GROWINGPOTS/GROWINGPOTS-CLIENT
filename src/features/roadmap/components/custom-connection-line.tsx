'use client';

import { ConnectionLineComponentProps, getSmoothStepPath, Position } from '@xyflow/react';

export const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition ?? Position.Right,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition ?? Position.Left,
  });

  return (
    <g>
      <path fill="none" stroke="#84cc16" strokeWidth={2} strokeDasharray="6 3" d={edgePath} />
      <circle cx={toX} cy={toY} r={4} fill="#84cc16" />
    </g>
  );
};
