export interface PendingFocusTerm {
  yearLevel: number;
  semesterLabel: string;
}

let pendingFocusTerm: PendingFocusTerm | null = null;

export const setPendingFocusTerm = (term: PendingFocusTerm) => {
  pendingFocusTerm = term;
};

export const peekPendingFocusTerm = (): PendingFocusTerm | null => pendingFocusTerm;

export const clearPendingFocusTerm = () => {
  pendingFocusTerm = null;
};
