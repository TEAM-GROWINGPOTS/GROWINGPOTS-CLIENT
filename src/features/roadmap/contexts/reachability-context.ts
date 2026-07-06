'use client';

import { createContext, useContext } from 'react';

interface ReachabilityContextValue {
  reachableNodeIds: Set<string>;
  reachableEdgeIds: Set<string>;
  displacedNodeId: string | null;
}

export const ReachabilityContext = createContext<ReachabilityContextValue>({
  reachableNodeIds: new Set(),
  reachableEdgeIds: new Set(),
  displacedNodeId: null,
});

export const useReachability = () => useContext(ReachabilityContext);
