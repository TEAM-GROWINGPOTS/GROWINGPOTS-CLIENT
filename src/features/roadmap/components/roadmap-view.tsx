'use client';

import '@xyflow/react/dist/style.css';

import graduation from '@features/roadmap/assets/graduation.json';
import { ReachabilityContext } from '@features/roadmap/contexts/reachability-context';
import { usePlannerGraph } from '@features/roadmap/hooks/use-planner-graph';
import { GRADUATION_REQUIREMENTS, PlannerNodeData, SemesterEdgeData } from '@features/roadmap/types';
import { AddSemesterModal } from '@features/semester-planner/card-view/modals/add-semester-modal';
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  ViewportPortal,
} from '@xyflow/react';
import Lottie from 'lottie-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AddSemesterNode } from './add-semester-node';
import { AddVersionNode } from './add-version-node';
import { CustomConnectionLine } from './custom-connection-line';
import { DropIndicatorLine } from './drop-indicator-line';
import { RoadmapHeader } from './roadmap-header';
import { SemesterEdge } from './semester-edge';
import { SemesterNode } from './semester-node';

const ROW_GAP = 150;
const ROW_MARGIN = 20; // 같은 열 카드 사이 여백
const NODE_HEIGHT = 300;

// 같은 열 노드들을 실제 measured 높이 기준으로 y 재배치
const recomputeColumnPositions = (nodes: Node<PlannerNodeData>[]): Node<PlannerNodeData>[] => {
  const byCol = new Map<number, Node[]>();
  for (const node of nodes) {
    if (node.type === 'addSemesterNode' || node.type === 'addVersionNode') continue;
    const colIndex = node.data.colIndex;
    if (colIndex === undefined) continue;
    if (!byCol.has(colIndex)) byCol.set(colIndex, []);
    byCol.get(colIndex)!.push(node);
  }

  const updatedY = new Map<string, number>();
  // colIndex → { bottom: 다음 노드가 올 y, center: 전체 중간 y }
  const colStats = new Map<number, { bottom: number; center: number }>();

  for (const [colIndex, colNodes] of byCol.entries()) {
    const sorted = [...colNodes].sort((a, b) => a.position.y - b.position.y);
    let y = 0;
    for (const node of sorted) {
      updatedY.set(node.id, y);
      y += (node.measured?.height ?? ROW_GAP) + ROW_MARGIN;
    }
    const totalHeight = y - ROW_MARGIN;
    colStats.set(colIndex, { bottom: y, center: totalHeight / 2 });
  }

  let maxPlannedColIndex = -1;
  for (const colIndex of byCol.keys()) {
    if (colIndex > maxPlannedColIndex) maxPlannedColIndex = colIndex;
  }

  return nodes.map((n) => {
    if (n.type === 'addVersionNode') {
      const colIndex = (n.data as Partial<PlannerNodeData>).colIndex;
      if (typeof colIndex !== 'number') return n;
      const newY = colStats.get(colIndex)?.bottom ?? n.position.y;
      return newY !== n.position.y ? { ...n, position: { ...n.position, y: newY } } : n;
    }
    if (n.type === 'addSemesterNode') {
      const newY = colStats.get(maxPlannedColIndex)?.center ?? n.position.y;
      return newY !== n.position.y ? { ...n, position: { ...n.position, y: newY } } : n;
    }
    const newY = updatedY.get(n.id);
    if (newY === undefined || n.position.y === newY) return n;
    return { ...n, position: { ...n.position, y: newY } };
  });
};

interface DropTarget {
  targetIdx: number;
  lineY: number;
}

// 드래그 중인 카드를 같은 컬럼의 형제들 사이 어디에 놓을지 계산한다.
// 위로 올릴 땐 카드의 윗변, 아래로 내릴 땐 아랫변을 기준선으로 삼아 형제의 중심점과 비교한다.
// down에서 <=를 쓰는 이유: 기준선이 마지막 형제의 중심점과 같거나 넘어간 경우까지 "지나감"으로 잡아야
// 마지막 카드를 넘어가는 케이스가 siblings.length(맨 끝)로 자연스럽게 이어진다.
const computeDropTarget = (
  nodeY: number,
  nodeHeight: number,
  direction: 'up' | 'down',
  siblings: Node<PlannerNodeData>[],
): DropTarget => {
  const siblingHeight = (s: Node<PlannerNodeData>) => s.measured?.height ?? NODE_HEIGHT;
  const refY = direction === 'up' ? nodeY : nodeY + nodeHeight;

  const targetIdx =
    direction === 'up'
      ? siblings.filter((s) => s.position.y + siblingHeight(s) / 2 < refY).length
      : siblings.filter((s) => s.position.y + siblingHeight(s) / 2 <= refY).length;

  if (siblings.length === 0) return { targetIdx, lineY: nodeY };
  if (targetIdx === 0) return { targetIdx, lineY: siblings[0].position.y - ROW_MARGIN / 2 };
  if (targetIdx === siblings.length) {
    const last = siblings[siblings.length - 1];
    return { targetIdx, lineY: last.position.y + siblingHeight(last) + ROW_MARGIN / 2 };
  }

  const upper = siblings[targetIdx - 1];
  const lower = siblings[targetIdx];
  return { targetIdx, lineY: (upper.position.y + siblingHeight(upper) + lower.position.y) / 2 };
};

// 체인(첫 완료 학기 → ... → 마지막 선택 버전)을 따라 엣지별 누적 학점을 계산한다.
// "컬럼당 연결은 하나"라는 불변식 덕분에 매 노드는 outgoing 엣지가 최대 하나이므로 선형 순회로 충분하다.
const computeChainCredits = (nodes: Node<PlannerNodeData>[], edges: Edge<SemesterEdgeData>[]): Map<string, number> => {
  const creditById = new Map(nodes.map((n) => [n.id, (n.data as Partial<PlannerNodeData>).totalCredit ?? 0]));
  const outgoingBySource = new Map<string, Edge<SemesterEdgeData>>();
  const hasIncoming = new Set<string>();
  for (const e of edges) {
    outgoingBySource.set(e.source, e);
    hasIncoming.add(e.target);
  }

  const root = nodes.find((n) => n.type === 'semesterNode' && (n.data as Partial<PlannerNodeData>).colIndex === 0);
  const result = new Map<string, number>();
  let cumulative = 0;
  let current = root;

  while (current) {
    cumulative += creditById.get(current.id) ?? 0;
    const outEdge = outgoingBySource.get(current.id);
    if (!outEdge) break;
    result.set(outEdge.id, cumulative);
    current = nodes.find((n) => n.id === outEdge.target);
  }

  return result;
};

// PLANNED 상태 노드 중, 같은 컬럼(학기)에 버전이 이거 하나만 남아있는 노드의 id를 모은다.
const computeSoloVersionIds = (nodes: Node<PlannerNodeData>[]): Set<string> => {
  const countByCol = new Map<number, number>();
  for (const n of nodes) {
    if (n.type !== 'semesterNode') continue;
    const d = n.data as Partial<PlannerNodeData>;
    if (d.status !== 'PLANNED' || typeof d.colIndex !== 'number') continue;
    countByCol.set(d.colIndex, (countByCol.get(d.colIndex) ?? 0) + 1);
  }

  const result = new Set<string>();
  for (const n of nodes) {
    if (n.type !== 'semesterNode') continue;
    const d = n.data as Partial<PlannerNodeData>;
    if (d.status !== 'PLANNED' || typeof d.colIndex !== 'number') continue;
    if ((countByCol.get(d.colIndex) ?? 0) <= 1) result.add(n.id);
  }
  return result;
};

const computeReachableIds = (
  completedIds: Set<string>,
  edges: Edge[],
): { nodeIds: Set<string>; edgeIds: Set<string> } => {
  const nodeIds = new Set<string>(completedIds);
  const edgeIds = new Set<string>();
  const queue = [...completedIds];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.source === current) {
        edgeIds.add(edge.id);
        if (!nodeIds.has(edge.target)) {
          nodeIds.add(edge.target);
          queue.push(edge.target);
        }
      }
    }
  }

  return { nodeIds, edgeIds };
};

const nodeTypes = {
  semesterNode: SemesterNode,
  addSemesterNode: AddSemesterNode,
  addVersionNode: AddVersionNode,
};

const edgeTypes = { semesterEdge: SemesterEdge };

interface RoadmapViewProps {
  onViewChange: (view: 'card' | 'roadmap') => void;
}

export const RoadmapView = ({ onViewChange }: RoadmapViewProps) => {
  const { nodes: initialNodes, edges: initialEdges, completedIds } = usePlannerGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [dropIndicator, setDropIndicator] = useState<{ colX: number; y: number } | null>(null);
  const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
  const [isCelebrationDismissed, setIsCelebrationDismissed] = useState(false);

  const reconnectingEdgeId = useRef<string | null>(null);
  const dragDirectionRef = useRef<{ lastY: number; direction: 'up' | 'down' }>({ lastY: 0, direction: 'down' });
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // 노드 높이 변화(아코디언 열기/닫기) 감지 → 같은 열 y 재배치
  const measuredHeightsRef = useRef<Map<string, number>>(new Map());
  // 아코디언 CSS 애니메이션(200ms)이 진행되는 동안 ResizeObserver가 프레임마다 높이 변화를 감지해서
  // recompute가 그때마다 실행되면 애니메이션과 경쟁하며 뚝뚝 끊겨 보인다. 트랜지션이 끝난 뒤
  // 한 번만 재배치하도록 debounce한다.
  const recomputeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    let changed = false;
    const next = new Map<string, number>();
    for (const node of nodes) {
      const h = node.measured?.height;
      if (h === undefined) continue;
      next.set(node.id, h);
      if (measuredHeightsRef.current.get(node.id) !== h) changed = true;
    }
    if (!changed) return;
    measuredHeightsRef.current = next;
    clearTimeout(recomputeTimeoutRef.current);
    recomputeTimeoutRef.current = setTimeout(() => setNodes(recomputeColumnPositions), 220);
  }, [nodes, setNodes]);

  const reachability = useMemo(() => computeReachableIds(completedIds, edges), [completedIds, edges]);
  const edgeCredits = useMemo(() => computeChainCredits(nodes, edges), [nodes, edges]);
  const soloVersionNodeIds = useMemo(() => computeSoloVersionIds(nodes), [nodes]);
  // edgeCredits(체인 선형 순회)는 "노드당 outgoing 엣지 하나"를 가정하는데, 재연결 도중 엣지 배열이
  // 일시적으로 어긋나면 stub까지 못 가고 끊길 수 있다. reachability는 BFS라 이런 상황에 더 견고하므로
  // 로또 표시 여부를 판단하는 총 학점은 reachable 노드 학점을 직접 합산해서 구한다.
  const totalCredits = useMemo(() => {
    let sum = 0;
    for (const n of nodes) {
      if (n.type !== 'semesterNode' || !reachability.nodeIds.has(n.id)) continue;
      sum += (n.data as Partial<PlannerNodeData>).totalCredit ?? 0;
    }
    return sum;
  }, [nodes, reachability.nodeIds]);
  const showCelebration = totalCredits >= GRADUATION_REQUIREMENTS.전체 && !isCelebrationDismissed;

  // 드래그 시작 시점에 이 카드가 형제들 사이에서 원래 있던 인덱스를 기록해둔다.
  // onNodeDrag에서 targetIdx가 이 값과 같으면(=놓아도 제자리) 인디케이터 라인을 띄우지 않는다.
  const originalIdxRef = useRef(0);

  const onNodeDragStart = useCallback((_: unknown, node: Node) => {
    dragDirectionRef.current = { lastY: node.position.y, direction: 'down' };

    const colIndex = (node.data as Partial<PlannerNodeData>).colIndex;
    const siblings = nodesRef.current.filter(
      (n) =>
        n.id !== node.id &&
        typeof (n.data as Partial<PlannerNodeData>).colIndex === 'number' &&
        (n.data as Partial<PlannerNodeData>).colIndex === colIndex,
    );
    originalIdxRef.current = siblings.filter((s) => s.position.y < node.position.y).length;
  }, []);

  const onNodeDrag = useCallback(
    (_: unknown, node: Node) => {
      const colX = (node.data as Partial<PlannerNodeData>).colX;
      const colIndex = (node.data as Partial<PlannerNodeData>).colIndex;
      if (typeof colX !== 'number' || typeof colIndex !== 'number') return;

      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, position: { x: colX, y: node.position.y } } : n)));

      const delta = node.position.y - dragDirectionRef.current.lastY;
      if (delta !== 0) {
        dragDirectionRef.current = { lastY: node.position.y, direction: delta > 0 ? 'down' : 'up' };
      }

      const siblings = nodesRef.current
        .filter(
          (n) =>
            n.id !== node.id &&
            typeof (n.data as Partial<PlannerNodeData>).colIndex === 'number' &&
            (n.data as Partial<PlannerNodeData>).colIndex === colIndex,
        )
        .sort((a, b) => a.position.y - b.position.y) as Node<PlannerNodeData>[];

      const nodeHeight = node.measured?.height ?? NODE_HEIGHT;
      const { targetIdx, lineY } = computeDropTarget(
        node.position.y,
        nodeHeight,
        dragDirectionRef.current.direction,
        siblings,
      );
      // 놓아도 원래 자리로 돌아가는 경우엔 라인을 띄우지 않는다.
      setDropIndicator(targetIdx === originalIdxRef.current ? null : { colX, y: lineY });
    },
    [setNodes],
  );

  const onNodeDragStop = useCallback(
    (_: unknown, node: Node) => {
      const colX = (node.data as Partial<PlannerNodeData>).colX;
      const colIndex = (node.data as Partial<PlannerNodeData>).colIndex;
      if (typeof colX !== 'number' || typeof colIndex !== 'number') return;

      setDropIndicator(null);

      setNodes((nds) => {
        const siblings = nds
          .filter(
            (n) =>
              n.id !== node.id &&
              typeof (n.data as Partial<PlannerNodeData>).colIndex === 'number' &&
              (n.data as Partial<PlannerNodeData>).colIndex === colIndex,
          )
          .sort((a, b) => a.position.y - b.position.y) as Node<PlannerNodeData>[];

        const nodeHeight = node.measured?.height ?? NODE_HEIGHT;
        const { targetIdx } = computeDropTarget(
          node.position.y,
          nodeHeight,
          dragDirectionRef.current.direction,
          siblings,
        );

        const ordered = [...siblings];
        ordered.splice(targetIdx, 0, node as Node<PlannerNodeData>);
        // 순서 확정 후 임시 y(ROW_GAP 단위)를 부여 → recomputeColumnPositions가 실제 높이로 재계산
        const positionMap = new Map(ordered.map((n, i) => [n.id, i * ROW_GAP]));

        const reordered = nds.map((n) => {
          const newY = positionMap.get(n.id);
          return newY !== undefined ? { ...n, position: { x: colX, y: newY } } : n;
        });
        return recomputeColumnPositions(reordered);
      });
    },
    [setNodes],
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const src = nodesRef.current.find((n) => n.id === connection.source);
      const tgt = nodesRef.current.find((n) => n.id === connection.target);
      if (!src || !tgt) return false;

      const srcCol = (src.data as Partial<PlannerNodeData>).colIndex;
      const tgtCol = (tgt.data as Partial<PlannerNodeData>).colIndex;
      if (typeof srcCol !== 'number' || typeof tgtCol !== 'number') return false;
      if (tgtCol !== srcCol + 1) return false;

      const rid = reconnectingEdgeId.current;
      const hasInitialFromSrc = edges.some(
        (e) => e.source === connection.source && (e.data as Partial<SemesterEdgeData>)?.isInitial && e.id !== rid,
      );
      if (hasInitialFromSrc) return false;

      const hasInitialToTgt = edges.some(
        (e) => e.target === connection.target && (e.data as Partial<SemesterEdgeData>)?.isInitial && e.id !== rid,
      );
      if (hasInitialToTgt) return false;

      return true;
    },
    [edges],
  );

  // onConnect(새 핸들에서 드래그)와 onReconnect(기존 엣지 끝점 드래그) 모두 "컬럼당 연결은 하나"라는
  // 불변식을 지켜야 하므로 같은 정리 로직을 공유한다. isSelected는 이 결과 edges로부터 reachability가
  // 파생하므로 여기서 별도로 node.data를 patch하지 않는다.
  const buildConnectionEdges = useCallback((prev: Edge<SemesterEdgeData>[], connection: Connection) => {
    const srcNode = nodesRef.current.find((n) => n.id === connection.source);
    if (!srcNode) return prev;

    const srcCol = (srcNode.data as Partial<PlannerNodeData>).colIndex;
    if (typeof srcCol !== 'number') return prev;

    const colXNodeIds = nodesRef.current
      .filter((n) => (n.data as Partial<PlannerNodeData>).colIndex === srcCol && n.id !== connection.source)
      .map((n) => n.id);

    const oldEdge = prev.find((e) => colXNodeIds.includes(e.source));
    const idsToDelete = new Set<string>();
    const edgesToAdd: Edge<SemesterEdgeData>[] = [];

    if (oldEdge) {
      idsToDelete.add(oldEdge.id);
      const incomingToOld = prev.find((e) => e.target === oldEdge.source);
      if (incomingToOld) {
        idsToDelete.add(incomingToOld.id);
        edgesToAdd.push({
          ...(incomingToOld as Edge<SemesterEdgeData>),
          id: `e-redirect-${connection.source}-${Date.now()}`,
          target: connection.source,
        });
      }
    }

    const extraToTgt = prev.find((e) => e.target === connection.target && !idsToDelete.has(e.id));
    if (extraToTgt) idsToDelete.add(extraToTgt.id);

    const extraFromSrc = prev.find(
      (e) => e.source === connection.source && e.target !== connection.target && !idsToDelete.has(e.id),
    );
    if (extraFromSrc) idsToDelete.add(extraFromSrc.id);

    // target 컬럼 스왑: target의 형제(같은 컬럼의 다른 버전)가 기존에 체인의 활성 노드였다면, 그 형제가
    // 다음 컬럼으로 뻗던 outgoing 엣지를 새 target에서 나가도록 리다이렉트해서 뒷부분 체인이 끊기지 않게 한다.
    const tgtNode = nodesRef.current.find((n) => n.id === connection.target);
    const tgtCol = tgtNode ? (tgtNode.data as Partial<PlannerNodeData>).colIndex : undefined;
    if (typeof tgtCol === 'number') {
      const tgtColSiblingIds = nodesRef.current
        .filter((n) => (n.data as Partial<PlannerNodeData>).colIndex === tgtCol && n.id !== connection.target)
        .map((n) => n.id);

      const oldActiveOutgoing = prev.find((e) => tgtColSiblingIds.includes(e.source) && !idsToDelete.has(e.id));
      if (oldActiveOutgoing) {
        idsToDelete.add(oldActiveOutgoing.id);
        edgesToAdd.push({
          ...(oldActiveOutgoing as Edge<SemesterEdgeData>),
          id: `e-redirect-${connection.target}-${Date.now()}`,
          source: connection.target,
        });

        // onConnect처럼 기존 incoming 엣지가 아직 안 지워진 경우까지 정리
        const staleIncoming = prev.find((e) => e.target === oldActiveOutgoing.source && !idsToDelete.has(e.id));
        if (staleIncoming) idsToDelete.add(staleIncoming.id);
      }
    }

    const srcCredits = (srcNode.data as Partial<PlannerNodeData>).totalCredit ?? 0;
    edgesToAdd.push({
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      type: 'semesterEdge',
      data: { credits: srcCredits, isInitial: false } satisfies SemesterEdgeData,
      deletable: true,
    });

    return [...prev.filter((e) => !idsToDelete.has(e.id)), ...edgesToAdd];
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prev) => buildConnectionEdges(prev, connection));
    },
    [setEdges, buildConnectionEdges],
  );

  const onReconnectStart = useCallback((_: unknown, edge: Edge<SemesterEdgeData>) => {
    reconnectingEdgeId.current = edge.id;
  }, []);

  const onReconnect = useCallback(
    (_oldEdge: Edge, newConnection: Connection) => {
      // 드래그되던 엣지를 미리 지우면 안 된다: buildConnectionEdges의 source 쪽 컬럼 스왑 로직은
      // "형제 노드의 기존 outgoing 엣지가 아직 prev에 남아있는지"로 리다이렉트 대상을 찾기 때문에,
      // 여기서 미리 지워버리면 그 판단 자체가 불가능해져 체인이 끊긴다. buildConnectionEdges가
      // 구조적으로(같은 컬럼/같은 source/같은 target 매칭) 옛 엣지를 알아서 찾아 정리하게 둔다.
      setEdges((prev) => buildConnectionEdges(prev, newConnection));
    },
    [setEdges, buildConnectionEdges],
  );

  // 유효한 핸들에 놓지 못하면 그냥 아무 것도 하지 않는다: edges state를 건드리지 않으므로
  // 엣지가 원래 있던 자리(연결)로 그대로 남는다. onReconnect가 호출된 경우에만 실제로 바뀐다.
  const onReconnectEnd = useCallback(() => {
    reconnectingEdgeId.current = null;
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'addSemesterNode') {
        setIsAddSemesterModalOpen(true);
        return;
      }
      if (node.type === 'addVersionNode') onViewChange('card');
    },
    [onViewChange],
  );

  const handleAddSemesterSubmit = useCallback(
    (_year: string, _semester: string) => {
      // TODO: 실제 학기 추가(store/API) 연동은 아직 없다 — 지금은 모달 제출 후 카드뷰로 전환만 한다.
      onViewChange('card');
    },
    [onViewChange],
  );

  return (
    <ReachabilityContext.Provider
      value={{
        reachableNodeIds: reachability.nodeIds,
        reachableEdgeIds: reachability.edgeIds,
        edgeCredits,
        soloVersionNodeIds,
      }}
    >
      <div className="relative h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={CustomConnectionLine}
          isValidConnection={isValidConnection}
          connectionRadius={40}
          reconnectRadius={40}
          defaultViewport={{ x: 40, y: 160, zoom: 1 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={25} size={3} color="#e5e7eb" />
          <Controls position="bottom-left" />
          <Panel position="top-right">
            <RoadmapHeader />
          </Panel>
          {dropIndicator && (
            <ViewportPortal>
              <DropIndicatorLine colX={dropIndicator.colX} y={dropIndicator.y} />
            </ViewportPortal>
          )}
        </ReactFlow>

        {showCelebration && (
          <div
            className="z-analysis-loading absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-white/40"
            onClick={() => setIsCelebrationDismissed(true)}
          >
            <Lottie animationData={graduation} loop autoplay className="h-400 w-400" />
            <p className="text-title-sb-24 text-gray-700">졸업 요건을 충족했어요!</p>
          </div>
        )}
      </div>

      <AddSemesterModal
        open={isAddSemesterModalOpen}
        onOpenChange={setIsAddSemesterModalOpen}
        onSubmit={handleAddSemesterSubmit}
      />
    </ReachabilityContext.Provider>
  );
};

export const checkGraduationFulfilled = (earned: Record<string, number>): boolean => {
  return Object.entries(GRADUATION_REQUIREMENTS).every(([key, required]) => (earned[key] ?? 0) >= required);
};
