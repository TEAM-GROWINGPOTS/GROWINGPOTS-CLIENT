'use client';

import { createContext, useContext } from 'react';

interface PlannerActionsContextValue {
  onDeleteFolder: (termId: string, folderId: string, folderName: string) => void;
}

export const PlannerActionsContext = createContext<PlannerActionsContextValue>({
  onDeleteFolder: () => {},
});

export const usePlannerActions = () => useContext(PlannerActionsContext);
