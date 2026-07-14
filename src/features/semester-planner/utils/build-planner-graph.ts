import type { PlannerResponse } from '@features/semester-planner/types/planner';
import type { PlannerNodeData, SemesterEdgeData } from '@features/semester-planner/types/planner-graph';
import type { Edge, Node } from '@xyflow/react';

const COL_GAP = 370;

function toTermLabel(yearLevel: number, semester: number): string {
  return `${yearLevel}학년 ${semester}학기`;
}

export interface PlannerGraph {
  nodes: Node<PlannerNodeData>[];
  edges: Edge<SemesterEdgeData>[];
  completedIds: Set<string>;
}

export function buildPlannerGraph(data: PlannerResponse): PlannerGraph {
  const nodes: Node<PlannerNodeData>[] = [];
  const edges: Edge<SemesterEdgeData>[] = [];
  const completedIds = new Set<string>();

  const sortedCompleted = [...data.completedTerms].sort((a, b) => a.yearLevel - b.yearLevel || a.semester - b.semester);

  // 누적 학점 추적 (엣지 라벨 = 해당 엣지 source까지의 누적)
  let cumulativeCredits = 0;

  sortedCompleted.forEach((term, colIndex) => {
    const nodeId = String(term.plannerTermVersionId);
    const colX = colIndex * COL_GAP;
    completedIds.add(nodeId);

    nodes.push({
      id: nodeId,
      type: 'semesterNode',
      position: { x: colX, y: 100 },
      data: {
        plannerTermVersionId: term.plannerTermVersionId,
        locked: true,
        colIndex,
        colX,
        status: term.status,
        isSelected: true,
        termName: term.name,
        folderName: term.name,
        totalCredit: term.totalCredit,
        courses: term.courses.map((c) => ({
          id: c.studentCourseId,
          courseName: c.name,
          divisionCategory: c.divisionCategory,
          divisionName: c.divisionName,
        })),
      },
      draggable: false,
    });

    if (colIndex > 0) {
      const prevId = String(sortedCompleted[colIndex - 1].plannerTermVersionId);
      edges.push({
        id: `e-init-${prevId}-${nodeId}`,
        source: prevId,
        target: nodeId,
        type: 'semesterEdge',
        // cumulativeCredits는 이 시점에 이전 노드까지의 합
        data: { credits: cumulativeCredits, isInitial: true },
        deletable: false,
        reconnectable: false,
      });
    }

    cumulativeCredits += term.totalCredit;
  });
  // 이후 cumulativeCredits = 완료 학기 전체 학점 합

  const sortedPlanned = [...data.plannedTerms].sort((a, b) => a.yearLevel - b.yearLevel || a.semester - b.semester);
  const colOffset = sortedCompleted.length;

  sortedPlanned.forEach((term, termIdx) => {
    const colIndex = colOffset + termIdx;
    const colX = colIndex * COL_GAP;
    const termName = toTermLabel(term.yearLevel, term.semester);
    const sortedVersions = [...term.versions].sort((a, b) => a.versionOrder - b.versionOrder);

    sortedVersions.forEach((version, rowIdx) => {
      const sortedCourses = [...version.courses].sort((a, b) => a.coursePositionOrder - b.coursePositionOrder);

      nodes.push({
        id: String(version.plannerTermVersionId),
        type: 'semesterNode',
        position: { x: colX, y: rowIdx },
        data: {
          plannerTermVersionId: version.plannerTermVersionId,
          locked: false,
          colIndex,
          colX,
          status: 'PLANNED',
          isSelected: version.isSelected,
          termName,
          folderName: version.name,
          totalCredit: version.totalCredit,
          courses: sortedCourses.map((c) => ({
            id: c.plannerVersionItemId,
            courseName: c.name,
            divisionCategory: c.divisionCategory,
            divisionName: c.divisionName,
          })),
        },
        draggable: true,
      });
    });

    // 각 planned 컬럼 아래 버전 추가 버튼
    nodes.push({
      id: `add-version-${term.plannerTermId}`,
      type: 'addVersionNode',
      position: { x: colX, y: 0 },
      data: { colIndex, colX, versionCount: sortedVersions.length } as unknown as PlannerNodeData,
      draggable: false,
      connectable: false,
      selectable: false,
    });
  });

  // 선택 체인 엣지: 마지막 완료학기 → 각 계획학기의 isSelected 버전
  let lastChainNodeId: string | null =
    sortedCompleted.length > 0 ? String(sortedCompleted[sortedCompleted.length - 1].plannerTermVersionId) : null;

  if (sortedCompleted.length > 0 && sortedPlanned.length > 0) {
    const lastCompletedId = String(sortedCompleted[sortedCompleted.length - 1].plannerTermVersionId);

    const selectedVersionIds = sortedPlanned.map((term) => {
      const sortedVersions = [...term.versions].sort((a, b) => a.versionOrder - b.versionOrder);
      const selected = sortedVersions.find((v) => v.isSelected) ?? sortedVersions[0];
      return { id: String(selected.plannerTermVersionId), totalCredit: selected.totalCredit };
    });

    const chainIds = [{ id: lastCompletedId, totalCredit: 0 }, ...selectedVersionIds];
    let chainCumulative = cumulativeCredits; // 완료 전체 합에서 시작

    for (let i = 0; i < chainIds.length - 1; i++) {
      const src = chainIds[i];
      const tgt = chainIds[i + 1];
      edges.push({
        id: `e-chain-${src.id}-${tgt.id}`,
        source: src.id,
        target: tgt.id,
        type: 'semesterEdge',
        data: { credits: chainCumulative, isInitial: false },
        deletable: true,
        reconnectable: true,
      });
      chainCumulative += tgt.totalCredit;
    }

    cumulativeCredits = chainCumulative;
    lastChainNodeId = selectedVersionIds[selectedVersionIds.length - 1].id;
  }

  // + 버튼 노드
  const lastColIndex = colOffset + sortedPlanned.length;
  nodes.push({
    id: 'add-semester',
    type: 'addSemesterNode',
    position: { x: lastColIndex * COL_GAP - 30, y: 0 },
    data: {} as PlannerNodeData,
    draggable: false,
    connectable: false,
    selectable: false,
  });

  // 총 누적 학점 stub 엣지: 마지막 체인 노드에서 짧게 뻗는 선 + 라벨
  if (lastChainNodeId) {
    edges.push({
      id: 'e-credit-stub',
      source: lastChainNodeId,
      target: 'add-semester',
      type: 'semesterEdge',
      data: { credits: cumulativeCredits, isInitial: false, isStub: true },
      deletable: false,
      reconnectable: false,
      selectable: false,
    });
  }

  return { nodes, edges, completedIds };
}
