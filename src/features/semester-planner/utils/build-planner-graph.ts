import type { PlannerFolder, PlannerTerm } from '@features/semester-planner/types/planner';
import type { PlannerNodeData, SemesterEdgeData } from '@features/semester-planner/types/planner-graph';
import type { Edge, Node } from '@xyflow/react';

const COL_GAP = 370;

function toTermLabel(yearLevel: number, semester: number): string {
  return `${yearLevel}학년 ${semester}학기`;
}

const getFolderCredit = (folder: PlannerFolder): number => folder.courses.reduce((sum, { credit }) => sum + credit, 0);

export interface PlannerGraph {
  nodes: Node<PlannerNodeData>[];
  edges: Edge<SemesterEdgeData>[];
  completedIds: Set<string>;
}

export function buildPlannerGraph(completedTerms: PlannerTerm[], plannedTerms: PlannerTerm[]): PlannerGraph {
  const nodes: Node<PlannerNodeData>[] = [];
  const edges: Edge<SemesterEdgeData>[] = [];
  const completedIds = new Set<string>();

  // 누적 학점 추적 (엣지 라벨 = 해당 엣지 source까지의 누적)
  let cumulativeCredits = 0;

  completedTerms.forEach((term, colIndex) => {
    const folder = term.folders[0];
    const nodeId = folder.id;
    const colX = colIndex * COL_GAP;
    completedIds.add(nodeId);
    const totalCredit = getFolderCredit(folder);

    nodes.push({
      id: nodeId,
      type: 'semesterNode',
      position: { x: colX, y: 100 },
      data: {
        plannerTermVersionId: Number(nodeId),
        locked: true,
        colIndex,
        colX,
        status: term.status === 'current' ? 'IN_PROGRESS' : 'COMPLETED',
        isSelected: true,
        termName: folder.name,
        folderName: folder.name,
        totalCredit,
        courses: folder.courses.map((c) => ({
          id: Number(c.id),
          courseName: c.name,
          divisionCategory: c.divisionCategory ?? null,
          divisionName: c.divisionName,
        })),
      },
      draggable: false,
    });

    if (colIndex > 0) {
      const prevId = completedTerms[colIndex - 1].folders[0].id;
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

    cumulativeCredits += totalCredit;
  });
  // 이후 cumulativeCredits = 완료 학기 전체 학점 합

  const colOffset = completedTerms.length;

  plannedTerms.forEach((term, termIdx) => {
    const colIndex = colOffset + termIdx;
    const colX = colIndex * COL_GAP;
    const termName = toTermLabel(term.yearLevel, term.semester);

    term.folders.forEach((folder, rowIdx) => {
      const totalCredit = getFolderCredit(folder);

      nodes.push({
        id: folder.id,
        type: 'semesterNode',
        position: { x: colX, y: rowIdx },
        data: {
          plannerTermVersionId: Number(folder.id),
          termId: term.id,
          locked: false,
          colIndex,
          colX,
          status: 'PLANNED',
          isSelected: folder.id === term.selectedFolderId,
          termName,
          folderName: folder.name,
          totalCredit,
          courses: folder.courses.map((c) => ({
            id: Number(c.id),
            courseName: c.name,
            divisionCategory: c.divisionCategory ?? null,
            divisionName: c.divisionName,
          })),
        },
        draggable: true,
      });
    });

    // 각 planned 컬럼 아래 버전 추가 버튼
    nodes.push({
      id: `add-version-${term.id}`,
      type: 'addVersionNode',
      position: { x: colX, y: 0 },
      data: { termId: term.id, colIndex, colX, versionCount: term.folders.length } as unknown as PlannerNodeData,
      draggable: false,
      connectable: false,
      selectable: false,
    });
  });

  // 선택 체인 엣지: 마지막 완료학기 → 각 계획학기의 선택된 폴더
  let lastChainNodeId: string | null =
    completedTerms.length > 0 ? completedTerms[completedTerms.length - 1].folders[0].id : null;

  if (completedTerms.length > 0 && plannedTerms.length > 0) {
    const lastCompletedId = completedTerms[completedTerms.length - 1].folders[0].id;

    const selectedFolders = plannedTerms.map((term) => {
      const selected = term.folders.find(({ id }) => id === term.selectedFolderId) ?? term.folders[0];
      return { id: selected.id, totalCredit: getFolderCredit(selected) };
    });

    const chainIds = [{ id: lastCompletedId, totalCredit: 0 }, ...selectedFolders];
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
    lastChainNodeId = selectedFolders[selectedFolders.length - 1].id;
  }

  // + 버튼 노드
  const lastColIndex = colOffset + plannedTerms.length;
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
