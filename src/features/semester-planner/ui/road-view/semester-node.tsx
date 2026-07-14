'use client';

import { usePlannerActions } from '@features/semester-planner/contexts/planner-actions-context';
import { useReachability } from '@features/semester-planner/contexts/reachability-context';
import type { PlannerNodeType } from '@features/semester-planner/types/planner-graph';
import { cn } from '@shared/utils/cn';
import { Handle, NodeProps, Position, useNodeConnections } from '@xyflow/react';

import { NodeCard } from './node-card/node-card';

// xyflow는 엣지 연결 지점을 핸들의 "중심"이 아니라 Position.Left는 박스의 왼쪽 끝, Position.Right는
// 오른쪽 끝으로 계산한다(getHandlePosition). 그래서 Handle 자체를 키우면 보이는 점과 엣지가 붙는 위치가
// 어긋난다. 따라서 Handle 크기는 실제 시각적 크기(8px)로 고정하고, 클릭 가능 반경만 `::before` 가상
// 요소로 넓힌다 — 가상 요소는 getBoundingClientRect()에 영향을 주지 않아 엣지 연결 계산은 그대로다.
const HANDLE_VISUAL_SIZE = 8;
// 8px 원 기준 상하좌우 8px씩 더 넓혀서 총 24px 클릭 반경을 만든다.
const HANDLE_HIT_AREA_CLASS = "before:content-[''] before:absolute before:-inset-8";
// 왼쪽(target) 핸들은 폴더가 접혀 카드가 작아졌을 때 특히 놓치기 쉬워 히트 영역을 더 넓게 잡는다.
const HANDLE_HIT_AREA_CLASS_LEFT = "before:content-[''] before:absolute before:-inset-12";
// xyflow는 엣지의 source/target 위치에 이미 reconnect 전용 앵커(.react-flow__edgeupdater, cursor: move)를
// 겹쳐 그린다. 이미 연결된 핸들 위에서 우리 Handle이 포인터 이벤트를 가로채면 그 앵커에 손이 닿지 않아
// "새 엣지가 뻗어나가는" 것처럼 보인다. 연결이 있는 핸들은 포인터 이벤트를 꺼서 아래 앵커로 넘긴다.
const CONNECTED_HANDLE_CLASS = 'pointer-events-none';

const HANDLE_STYLE: React.CSSProperties = {
  width: HANDLE_VISUAL_SIZE,
  height: HANDLE_VISUAL_SIZE,
  background: 'transparent',
  border: 'none',
  // 핸들 중심이 카드 상단에서 24px 아래에 위치
  top: 24,
};

const HandleDot = () => (
  // border-radius(퍼센트)는 가로/세로를 축별로 따로 계산해 스케일된 화면에서 미세하게 찌그러 보일 수
  // 있다. SVG 원은 좌표 기반이라 어떤 스케일에서도 항상 정확한 원으로 렌더링된다.
  // viewBox를 원(반지름+선굵기)보다 1px 더 크게 둬야 stroke가 뷰박스 경계에서 잘리지 않는다.
  <svg
    width={HANDLE_VISUAL_SIZE + 2}
    height={HANDLE_VISUAL_SIZE + 2}
    viewBox="0 0 10 10"
    className="pointer-events-none absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 overflow-visible"
  >
    <circle cx={5} cy={5} r={3.5} fill="#fff" stroke="#667e07" strokeWidth={1} />
  </svg>
);

export const SemesterNode = ({ id, data, width, dragging }: NodeProps<PlannerNodeType>) => {
  const { reachableNodeIds, soloVersionNodeIds } = useReachability();
  const { onDeleteFolder } = usePlannerActions();
  // React Flow는 measure 전 노드 wrapper에 visibility:hidden을 걸어둔다. 이때 width는 undefined가 아니라 0으로 내려오므로
  // 메뉴 버튼만 강제로 visible 처리하면 measure 전에 버튼만 먼저 노출된다. measure 완료(width > 0) 후에만 켠다.
  const isMeasured = width !== undefined && width > 0;
  // isSelected는 data의 고정값이 아니라 엣지 연결 상태(completedIds에서 도달 가능한지)로부터 파생한다.
  // 엣지가 바뀌면 reachability가 같은 렌더에서 재계산되므로 별도로 patch할 필요가 없다.
  const isSelected = reachableNodeIds.has(id);

  // 이미 연결이 있는 핸들은 새 연결을 시작하지 못하게 하고, xyflow의 reconnect 앵커가 대신 반응하게 한다.
  const hasTargetConnection = useNodeConnections({ handleType: 'target' }).length > 0;
  const hasSourceConnection = useNodeConnections({ handleType: 'source' }).length > 0;

  const baseProps = {
    isSelected,
    termName: data.termName,
    folderName: data.folderName,
    totalCredit: data.totalCredit,
    courses: data.courses,
  };

  return (
    <div className={cn('transition-opacity duration-150', dragging && 'opacity-70')}>
      {data.colIndex !== 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={HANDLE_STYLE}
          isConnectableStart={!hasTargetConnection}
          className={cn(HANDLE_HIT_AREA_CLASS_LEFT, hasTargetConnection && CONNECTED_HANDLE_CLASS)}
        >
          <HandleDot />
        </Handle>
      )}

      {data.status === 'PLANNED' ? (
        <NodeCard
          {...baseProps}
          status="PLANNED"
          onDelete={() => data.termId && onDeleteFolder(data.termId, id, data.folderName)}
          isMenuVisible={isMeasured}
          isLastVersion={soloVersionNodeIds.has(id)}
        />
      ) : (
        <NodeCard {...baseProps} status={data.status} />
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={HANDLE_STYLE}
        isConnectableStart={!hasSourceConnection}
        className={cn(HANDLE_HIT_AREA_CLASS, hasSourceConnection && CONNECTED_HANDLE_CLASS)}
      >
        <HandleDot />
      </Handle>
    </div>
  );
};
