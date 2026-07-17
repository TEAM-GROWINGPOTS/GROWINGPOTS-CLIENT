export const isGuideSeen = (key: string): boolean => !!localStorage.getItem(key);

export const markGuideSeen = (key: string): void => {
  localStorage.setItem(key, 'true');
};
