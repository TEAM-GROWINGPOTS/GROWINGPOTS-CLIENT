export const hasSeenGuide = (key: string): boolean => {
  const seen = localStorage.getItem(key);
  if (!seen) localStorage.setItem(key, 'true');
  return !!seen;
};
