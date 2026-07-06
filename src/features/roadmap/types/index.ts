import { Edge, Node } from '@xyflow/react';

export type CourseType =
  '전공필수' | '전공선택' | '전공기초' | '필수교과' | '배분이수교과' | '자유이수교과' | '일반선택';

export interface Course {
  name: string;
  credits: number;
  type: CourseType;
}

export interface SemesterNodeData extends Record<string, unknown> {
  label: string;
  credits: number;
  courses: Course[];
  colIndex: number;
  colX: number;
  isCompleted: boolean;
}

export interface SemesterEdgeData extends Record<string, unknown> {
  credits: number;
  isInitial: boolean;
}

export type SemesterNodeType = Node<SemesterNodeData, 'semesterNode'>;
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
