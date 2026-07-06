'use client';

import { useReachability } from '@features/roadmap/contexts/reachability-context';
import { SemesterEdgeData } from '@features/roadmap/types';
import { cn } from '@shared/utils/cn';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export const SemesterEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<Edge<SemesterEdgeData>>) => {
  const { reachableEdgeIds } = useReachability();
  const isReachable = reachableEdgeIds.has(id);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = isReachable ? '#84cc16' : '#d1d5db';

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke, strokeWidth: 2, strokeDasharray: '6 3' }} />
      {(data?.credits ?? 0) > 0 && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'nodrag nopan pointer-events-none absolute rounded-full px-2.5 py-0.5 text-xs font-semibold text-white',
              isReachable ? 'bg-lime-400' : 'bg-gray-400',
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {data!.credits}학점
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
