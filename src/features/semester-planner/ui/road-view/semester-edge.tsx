'use client';

import { useReachability } from '@features/semester-planner/contexts/reachability-context';
import { SemesterEdgeData } from '@features/semester-planner/types/planner-graph';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';

const STUB_LENGTH = 15;

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
  const { edgeCredits } = useReachability();
  const isStub = data?.isStub ?? false;
  // data.credits는 엣지 생성 시점의 스냅샷이라 재연결 후 stale해질 수 있다.
  // 체인을 따라 매번 다시 계산되는 edgeCredits를 우선 사용한다.
  const credits = edgeCredits.get(id) ?? data?.credits ?? 0;

  const [smoothPath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 15,
  });

  const edgePath = isStub ? `M ${sourceX} ${sourceY} L ${sourceX + STUB_LENGTH} ${sourceY}` : smoothPath;

  const labelTransform = isStub
    ? `translate(0%, -50%) translate(${sourceX + STUB_LENGTH}px,${sourceY}px)`
    : `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: '#667e07', strokeWidth: 1, strokeDasharray: '3 3' }} />
      {credits > 0 && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan text-caption-m-12 pointer-events-none absolute inline-flex h-24 items-center justify-center gap-4 rounded bg-gray-600 px-8 py-4 text-white"
            style={{ transform: labelTransform }}
          >
            {credits}학점
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
