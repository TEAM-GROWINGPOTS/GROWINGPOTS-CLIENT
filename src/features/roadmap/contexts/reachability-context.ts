'use client';

import { createContext, useContext } from 'react';

interface ReachabilityContextValue {
  reachableNodeIds: Set<string>;
  reachableEdgeIds: Set<string>;
  /** 엣지 id → 그 엣지의 source까지 누적된 학점. 체인을 따라 매번 다시 계산되므로 재연결 후에도 항상 정확하다. */
  edgeCredits: Map<string, number>;
  /** 같은 학기(컬럼)에 버전이 이 하나만 남은 노드 id 집합 — 삭제 시 "마지막 폴더" 경고 문구 분기에 쓴다. */
  soloVersionNodeIds: Set<string>;
}

export const ReachabilityContext = createContext<ReachabilityContextValue>({
  reachableNodeIds: new Set(),
  reachableEdgeIds: new Set(),
  edgeCredits: new Map(),
  soloVersionNodeIds: new Set(),
});

export const useReachability = () => useContext(ReachabilityContext);
