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
    borderRadius: 10,
  });

  return (
    <g>
      <path fill="none" stroke="#667e07" strokeWidth={1} strokeDasharray="3 3" d={edgePath} />
      <circle cx={toX} cy={toY} r={4} fill="#fff" stroke="#667e07" strokeWidth={1} />
    </g>
  );
};
