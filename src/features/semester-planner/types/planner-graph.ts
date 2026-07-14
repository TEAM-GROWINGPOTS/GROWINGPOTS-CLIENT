import type { Edge, Node } from '@xyflow/react';

import type { NodeCardCourse } from './planner-node';

export type PlannerNodeStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

export interface PlannerNodeData extends Record<string, unknown> {
  plannerTermVersionId: number;
  /** planned 폴더가 속한 학기(PlannerTerm)의 id. 폴더 추가/삭제/전환/재정렬 요청에 쓴다. completed/current 학기는 없다. */
  termId?: string;
  locked: boolean;
  colIndex: number;
  colX: number;
  status: PlannerNodeStatus;
  isSelected: boolean;
  termName: string;
  folderName: string;
  totalCredit: number;
  courses: NodeCardCourse[];
}

export type PlannerNodeType = Node<PlannerNodeData, 'semesterNode'>;

export interface AddVersionNodeData extends Record<string, unknown> {
  termId: string;
  colIndex: number;
  colX: number;
  versionCount: number;
}

export type AddVersionNodeType = Node<AddVersionNodeData, 'addVersionNode'>;

export interface SemesterEdgeData extends Record<string, unknown> {
  credits: number;
  isInitial: boolean;
  isStub?: boolean;
}

export type SemesterEdgeType = Edge<SemesterEdgeData, 'semesterEdge'>;

export const GRADUATION_REQUIREMENTS: Record<string, number> = {
  전체: 120,
  전공: 55,
  전공필수: 13,
  전공선택: 42,
  전공기초: 10,
  필수교과: 55,
  배분이수교과: 13,
  자유이수교과: 42,
  일반선택: 42,
};
