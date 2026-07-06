'use client';

import { useReachability } from '@features/roadmap/contexts/reachability-context';
import { SemesterNodeType } from '@features/roadmap/types';
import { cn } from '@shared/utils/cn';
import { Handle, NodeProps, Position, useEdges } from '@xyflow/react';

export const SemesterNode = ({ id, data }: NodeProps<SemesterNodeType>) => {
  const { reachableNodeIds, displacedNodeId } = useReachability();
  const edges = useEdges();

  const hasIncoming = edges.some((e) => e.target === id);
  const hasOutgoing = edges.some((e) => e.source === id);

  const isReachable = reachableNodeIds.has(id);
  const isActive = isReachable;
  const isDropTarget = displacedNodeId === id;

  const handleBase = { width: 12, height: 12, border: '2px solid white', top: 16 };
  const targetHandleColor = isReachable && hasIncoming ? '#84cc16' : '#d1d5db';
  const sourceHandleColor = isReachable && hasOutgoing ? '#84cc16' : '#d1d5db';

  return (
    <div
      className={cn(
        'w-[220px] overflow-visible rounded-xl border-2 shadow-sm transition-all duration-150',
        isActive ? 'border-lime-300 bg-lime-50' : 'border-gray-200 bg-white',
        isDropTarget && 'scale-[0.93] opacity-60 ring-2 ring-lime-400 ring-offset-2',
      )}
    >
      {/* colIndex === 0 (첫 학기)는 왼쪽 핸들 없음 */}
      {data.colIndex !== 0 && (
        <Handle type="target" position={Position.Left} style={{ ...handleBase, background: targetHandleColor }} />
      )}

      {/* 헤더 — 커스텀 컴포넌트 주입 자리 */}
      <div
        className={cn(
          'flex items-center justify-between rounded-t-xl px-3 py-2',
          isActive ? 'bg-lime-100' : 'bg-gray-50',
        )}
      >
        <span className="text-sm font-semibold text-gray-800">{data.label}</span>
        <span className="text-xs text-gray-500">{data.credits}학점</span>
      </div>

      {/* 과목 목록 — 커스텀 컴포넌트 주입 자리 */}
      <ul className="space-y-1 p-3">
        {data.courses.map((course) => (
          <li key={course.name} className="truncate text-xs text-gray-600">
            {course.name}
          </li>
        ))}
      </ul>

      <Handle type="source" position={Position.Right} style={{ ...handleBase, background: sourceHandleColor }} />
    </div>
  );
};
