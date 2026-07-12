import { cn } from '@shared/utils/cn';

import { CARD_BASE_CLASS, CARD_LOGO_CONFIG, LEVEL_STYLES, LOGO_COLOR_BY_LEVEL, ProgressLevel } from '../constants';
import { GraduationProgressItem } from '../types';

const clampRatio = (value: number) => Math.max(0, Math.min(value, 1));

const getCompletionRatio = (item: GraduationProgressItem) => {
  if (item.required <= 0) return 0;
  return clampRatio(item.current / item.required);
};

export const getProgressLevel = (item: GraduationProgressItem): ProgressLevel => {
  const ratio = getCompletionRatio(item);
  if (ratio >= 1) return 3;
  if (ratio > 0.5) return 2;
  return 1;
};

export const isCompleted = (item: GraduationProgressItem) => getProgressLevel(item) === 3;

export const getCardClass = (
  item: GraduationProgressItem,
  level: ProgressLevel,
  isSelected: boolean,
  isSecondRow: boolean,
): string =>
  cn(
    CARD_BASE_CLASS,
    isSecondRow && 'h-140',
    LEVEL_STYLES[level].cardBackground.base,
    !item.isTotal && LEVEL_STYLES[level].cardBackground.hover,
    item.isTotal && 'w-[232px] justify-self-start bg-transparent',
    'transition-colors duration-300 ease-in-out',
    isSelected && 'ring-2 ring-lime-500 ring-offset-2 ring-offset-gray-100',
  );

export const getCardLogoDetails = (item: GraduationProgressItem, level: ProgressLevel) => {
  const config = CARD_LOGO_CONFIG[item.id] ?? null;
  if (!config) return null;

  return {
    ...config,
    colorClass: LOGO_COLOR_BY_LEVEL[level] ?? 'text-white/50',
  };
};

export const getTotalShapeClasses = (level: ProgressLevel) => LEVEL_STYLES[level].totalShape;
