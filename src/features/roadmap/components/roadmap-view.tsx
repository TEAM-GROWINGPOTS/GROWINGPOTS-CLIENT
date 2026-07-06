'use client';

import '@xyflow/react/dist/style.css';

import { ReachabilityContext } from '@features/roadmap/contexts/reachability-context';
import {
  Course,
  CourseType,
  GRADUATION_REQUIREMENTS,
  SemesterEdgeData,
  SemesterNodeData,
} from '@features/roadmap/types';
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  Panel,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AddSemesterNode } from './add-semester-node';
import { CustomConnectionLine } from './custom-connection-line';
import { RoadmapHeader } from './roadmap-header';
import { SemesterEdge } from './semester-edge';
import { SemesterNode } from './semester-node';

const COL_GAP = 300;
const ROW_GAP = 220;
const NODE_HEIGHT = 150;

// 카드뷰 데이터를 기반으로 구성하는 더미 데이터 (추후 props/store로 교체)
const DUMMY_SEMESTERS: {
  id: string;
  label: string;
  col: number;
  row: number;
  isCompleted: boolean;
  courses: Course[];
}[] = [
  {
    id: 'sem-1-1',
    label: '1학년 1학기',
    col: 0,
    row: 0,
    isCompleted: true,
    courses: [
      { name: '연극 문헌과 연기', credits: 6, type: '전공필수' as CourseType },
      { name: '화술1', credits: 6, type: '전공선택' as CourseType },
      { name: '전공탐색및기업가정신', credits: 4, type: '전공기초' as CourseType },
      { name: '교양과목', credits: 4, type: '필수교과' as CourseType },
      { name: '전공탐색세미나', credits: 3, type: '일반선택' as CourseType },
    ],
  },
  {
    id: 'sem-1-2-v1',
    label: '1학년 2학기',
    col: 1,
    row: 0,
    isCompleted: true,
    courses: [
      { name: '연기 기초', credits: 6, type: '전공필수' as CourseType },
      { name: '화술2', credits: 6, type: '전공선택' as CourseType },
      { name: '예술학 개론', credits: 5, type: '전공기초' as CourseType },
      { name: '문화 교양', credits: 6, type: '필수교과' as CourseType },
    ],
  },
  {
    id: 'sem-2-1-v1',
    label: '2학년 1학기',
    col: 2,
    row: 0,
    isCompleted: false,
    courses: [
      { name: '고급 연기', credits: 6, type: '전공필수' as CourseType },
      { name: '연출 기초', credits: 6, type: '전공선택' as CourseType },
      { name: '자유 이수', credits: 5, type: '자유이수교과' as CourseType },
      { name: '일반 교양', credits: 6, type: '필수교과' as CourseType },
    ],
  },
  {
    id: 'sem-2-1-v2',
    label: '2학년 1학기',
    col: 2,
    row: 1,
    isCompleted: false,
    courses: [
      { name: '무대 감독', credits: 6, type: '전공필수' as CourseType },
      { name: '공연 기획', credits: 6, type: '전공선택' as CourseType },
      { name: '예술 경영', credits: 5, type: '전공기초' as CourseType },
      { name: '자유 선택', credits: 6, type: '자유이수교과' as CourseType },
    ],
  },
  {
    id: 'sem-2-1-v3',
    label: '2학년 1학기',
    col: 2,
    row: 2,
    isCompleted: false,
    courses: [
      { name: '실험 연극', credits: 6, type: '전공선택' as CourseType },
      { name: '배분 교과', credits: 6, type: '배분이수교과' as CourseType },
      { name: '일반 선택2', credits: 5, type: '일반선택' as CourseType },
      { name: '자유 과목', credits: 6, type: '자유이수교과' as CourseType },
    ],
  },
  {
    id: 'sem-2-2-v1',
    label: '2학년 2학기',
    col: 3,
    row: 0,
    isCompleted: false,
    courses: [
      { name: '심화 연기', credits: 6, type: '전공필수' as CourseType },
      { name: '무대 연출', credits: 6, type: '전공선택' as CourseType },
      { name: '예술 정책', credits: 5, type: '전공기초' as CourseType },
      { name: '문화 예술 교육', credits: 6, type: '필수교과' as CourseType },
    ],
  },
  {
    id: 'sem-2-2-v2',
    label: '2학년 2학기',
    col: 3,
    row: 1,
    isCompleted: false,
    courses: [
      { name: '공연 기획', credits: 6, type: '전공필수' as CourseType },
      { name: '연극 비평', credits: 6, type: '전공선택' as CourseType },
      { name: '미디어 예술', credits: 5, type: '자유이수교과' as CourseType },
      { name: '일반선택 교과', credits: 6, type: '일반선택' as CourseType },
    ],
  },
];

const buildInitialNodes = (): Node[] => {
  const semesterNodes: Node<SemesterNodeData>[] = DUMMY_SEMESTERS.map((sem) => ({
    id: sem.id,
    type: 'semesterNode',
    position: { x: sem.col * COL_GAP, y: sem.row * ROW_GAP },
    data: {
      label: sem.label,
      credits: sem.courses.reduce((s, c) => s + c.credits, 0),
      courses: sem.courses,
      colIndex: sem.col,
      colX: sem.col * COL_GAP,
      isCompleted: sem.isCompleted,
    },
    draggable: !sem.isCompleted,
  }));

  const lastCol = Math.max(...DUMMY_SEMESTERS.map((s) => s.col));
  semesterNodes.push({
    id: 'add-semester',
    type: 'addSemesterNode',
    position: { x: (lastCol + 1) * COL_GAP - 30, y: ROW_GAP },
    data: {} as SemesterNodeData,
    draggable: false,
    connectable: false,
    selectable: false,
  });

  return semesterNodes;
};

// 이수완료 학기 간 초기 연결 (변경 불가)
const buildInitialEdges = (): Edge<SemesterEdgeData>[] => [
  {
    id: 'e-init-1',
    source: 'sem-1-1',
    target: 'sem-1-2-v1',
    type: 'semesterEdge',
    data: { credits: 23, isInitial: true },
    deletable: false,
    reconnectable: false,
  },
];

// 완료 학기에서 출발해 엣지를 따라 도달 가능한 노드/엣지 ID 계산
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

// 체인에 포함된 노드의 과목별 이수 학점 합산
const computeGraduationEarned = (nodes: Node[], reachableNodeIds: Set<string>): Record<string, number> => {
  const earned: Record<string, number> = {};

  for (const node of nodes) {
    if (!reachableNodeIds.has(node.id)) continue;
    const data = node.data as Partial<SemesterNodeData>;
    if (!Array.isArray(data.courses)) continue;

    for (const course of data.courses) {
      earned[course.type] = (earned[course.type] ?? 0) + course.credits;
      earned['전체'] = (earned['전체'] ?? 0) + course.credits;
      if (['전공필수', '전공선택', '전공기초'].includes(course.type)) {
        earned['전공'] = (earned['전공'] ?? 0) + course.credits;
      }
    }
  }

  return earned;
};

const nodeTypes = {
  semesterNode: SemesterNode,
  addSemesterNode: AddSemesterNode,
};

const edgeTypes = { semesterEdge: SemesterEdge };

// 이수완료 노드 ID는 고정 (초기화 시점에 결정)
const COMPLETED_IDS = new Set(DUMMY_SEMESTERS.filter((s) => s.isCompleted).map((s) => s.id));

interface RoadmapViewProps {
  view: 'card' | 'roadmap';
  onViewChange: (view: 'card' | 'roadmap') => void;
}

export const RoadmapView = ({ view, onViewChange }: RoadmapViewProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildInitialEdges());
  const [displacedNodeId, setDisplacedNodeId] = useState<string | null>(null);

  const edgeReconnectSuccessful = useRef(true);
  const reconnectingEdgeId = useRef<string | null>(null);
  // nodes ref: onNodeDrag 클로저에서 최신 nodes 참조 (dep 없이)
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // 체인 도달 가능 여부 계산 (edges 바뀔 때만 재계산)
  const reachability = useMemo(() => computeReachableIds(COMPLETED_IDS, edges), [edges]);

  // 졸업요건 이수 학점 계산 (nodes 또는 reachability 바뀔 때)
  const graduationEarned = useMemo(
    () => computeGraduationEarned(nodes, reachability.nodeIds),
    [nodes, reachability.nodeIds],
  );

  const onNodeDrag = useCallback(
    (_: unknown, node: Node) => {
      const colX = (node.data as Partial<SemesterNodeData>).colX;
      const colIndex = (node.data as Partial<SemesterNodeData>).colIndex;
      if (typeof colX !== 'number' || typeof colIndex !== 'number') return;

      // x축 고정
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, position: { x: colX, y: node.position.y } } : n)));

      // 닿은 형제의 절반(midpoint) 넘었을 때만 hover 발동
      const siblings = nodesRef.current
        .filter(
          (n) =>
            n.id !== node.id &&
            typeof (n.data as Partial<SemesterNodeData>).colIndex === 'number' &&
            (n.data as Partial<SemesterNodeData>).colIndex === colIndex,
        )
        .sort((a, b) => a.position.y - b.position.y);
      const displaced = siblings.find((sib) => {
        if (sib.position.y >= node.position.y) {
          // 아래쪽 형제: 드래그 카드 bottom이 형제 midpoint를 넘었을 때
          return node.position.y > sib.position.y - NODE_HEIGHT / 2;
        } else {
          // 위쪽 형제: 드래그 카드 top이 형제 midpoint 위로 올라갔을 때
          return node.position.y < sib.position.y + NODE_HEIGHT / 2;
        }
      });
      setDisplacedNodeId(displaced?.id ?? null);
    },
    [setNodes],
  );

  // 드랍 시: 같은 열 내 자동 재정렬 (행 스왑)
  const onNodeDragStop = useCallback(
    (_: unknown, node: Node) => {
      const colX = (node.data as Partial<SemesterNodeData>).colX;
      const colIndex = (node.data as Partial<SemesterNodeData>).colIndex;
      if (typeof colX !== 'number' || typeof colIndex !== 'number') return;

      setDisplacedNodeId(null);

      setNodes((nds) => {
        // 같은 열의 다른 노드들 (y 순서대로 정렬)
        const siblings = nds
          .filter(
            (n) =>
              n.id !== node.id &&
              typeof (n.data as Partial<SemesterNodeData>).colIndex === 'number' &&
              (n.data as Partial<SemesterNodeData>).colIndex === colIndex,
          )
          .sort((a, b) => a.position.y - b.position.y);

        // hover와 동일한 50% 겹침 기준으로 정렬 위치 결정
        const displaced = siblings.find((sib) => {
          if (sib.position.y >= node.position.y) {
            return node.position.y > sib.position.y - NODE_HEIGHT / 2;
          } else {
            return node.position.y < sib.position.y + NODE_HEIGHT / 2;
          }
        });

        let targetIdx: number;
        if (displaced) {
          if (displaced.position.y >= node.position.y) {
            // 아래쪽 형제가 밀려남: 드래그 노드가 형제 슬롯으로 이동
            targetIdx = siblings.indexOf(displaced) + 1;
          } else {
            // 위쪽 형제가 밀려남: 드래그 노드가 형제 슬롯 앞으로 이동
            targetIdx = siblings.indexOf(displaced);
          }
        } else {
          // hover 없음: 자연 위치(원래 자리) 복귀
          const insertIdx = siblings.findIndex((n) => n.position.y > node.position.y);
          targetIdx = insertIdx === -1 ? siblings.length : insertIdx;
        }

        // 드랍된 노드를 삽입 후 y 재배분
        const ordered = [...siblings];
        ordered.splice(targetIdx, 0, node);
        const positionMap = new Map(ordered.map((n, i) => [n.id, i * ROW_GAP]));

        return nds.map((n) => {
          const newY = positionMap.get(n.id);
          return newY !== undefined ? { ...n, position: { x: colX, y: newY } } : n;
        });
      });
    },
    [setNodes],
  );

  // 연결 유효성: 바로 다음 학기 열만 허용. 이수완료 학기의 fixed 엣지는 덮어쓰기 차단
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const src = nodesRef.current.find((n) => n.id === connection.source);
      const tgt = nodesRef.current.find((n) => n.id === connection.target);
      if (!src || !tgt) return false;

      const srcCol = (src.data as Partial<SemesterNodeData>).colIndex;
      const tgtCol = (tgt.data as Partial<SemesterNodeData>).colIndex;
      if (typeof srcCol !== 'number' || typeof tgtCol !== 'number') return false;
      if (tgtCol !== srcCol + 1) return false;

      const rid = reconnectingEdgeId.current;
      // initial(이수완료) 엣지가 있는 핸들은 덮어쓰기 불가
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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prev) => {
        const srcNode = nodesRef.current.find((n) => n.id === connection.source);
        if (!srcNode) return prev;

        const srcCol = (srcNode.data as Partial<SemesterNodeData>).colIndex;
        if (typeof srcCol !== 'number') return prev;

        // 같은 소스 열(col X)의 다른 노드가 col X+1으로 연결된 기존 엣지 탐색
        const colXNodeIds = nodesRef.current
          .filter((n) => (n.data as Partial<SemesterNodeData>).colIndex === srcCol && n.id !== connection.source)
          .map((n) => n.id);

        const oldEdge = prev.find((e) => colXNodeIds.includes(e.source));
        const idsToDelete = new Set<string>();
        const edgesToAdd: Edge<SemesterEdgeData>[] = [];

        if (oldEdge) {
          idsToDelete.add(oldEdge.id);
          // 기존 소스(oldEdge.source)의 이전 입력 엣지를 새 소스로 리다이렉트
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

        // 타겟에 이미 다른 소스가 연결된 경우도 제거
        const extraToTgt = prev.find((e) => e.target === connection.target && !idsToDelete.has(e.id));
        if (extraToTgt) idsToDelete.add(extraToTgt.id);

        // 소스가 다른 타겟에 이미 연결된 경우도 제거
        const extraFromSrc = prev.find(
          (e) => e.source === connection.source && e.target !== connection.target && !idsToDelete.has(e.id),
        );
        if (extraFromSrc) idsToDelete.add(extraFromSrc.id);

        const srcCredits = (srcNode.data as Partial<SemesterNodeData>).credits ?? 0;
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
      });
    },
    [setEdges],
  );

  // 드롭 시 엣지 삭제 (initial 엣지 제외)
  const onReconnectStart = useCallback((_: unknown, edge: Edge<SemesterEdgeData>) => {
    edgeReconnectSuccessful.current = false;
    reconnectingEdgeId.current = edge.id;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els) as Edge<SemesterEdgeData>[]);
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_: unknown, edge: Edge<SemesterEdgeData>) => {
      if (!edgeReconnectSuccessful.current && !(edge.data as Partial<SemesterEdgeData>)?.isInitial) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
      reconnectingEdgeId.current = null;
    },
    [setEdges],
  );

  // + 버튼 클릭 → 카드뷰 전환
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'addSemesterNode') onViewChange('card');
    },
    [onViewChange],
  );

  return (
    <ReachabilityContext.Provider
      value={{
        reachableNodeIds: reachability.nodeIds,
        reachableEdgeIds: reachability.edgeIds,
        displacedNodeId,
      }}
    >
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
          reconnectRadius={20}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
          <Controls position="bottom-left" />

          {/* 헤더를 캔버스 배경 위에 오버레이로 배치 */}
          <Panel position="top-left" style={{ right: 0, margin: 0 }}>
            <RoadmapHeader view={view} onViewChange={onViewChange} graduationEarned={graduationEarned} />
          </Panel>
        </ReactFlow>
      </div>
    </ReachabilityContext.Provider>
  );
};

// 졸업요건 충족 여부 확인 유틸 (외부에서 사용 가능)
export const checkGraduationFulfilled = (earned: Record<string, number>): boolean => {
  return Object.entries(GRADUATION_REQUIREMENTS).every(([key, required]) => (earned[key] ?? 0) >= required);
};
