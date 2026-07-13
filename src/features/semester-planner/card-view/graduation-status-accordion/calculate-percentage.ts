export const calculatePercentage = (current: number, required: number): number =>
  required > 0 ? Math.min((current / required) * 100, 100) : 0;
