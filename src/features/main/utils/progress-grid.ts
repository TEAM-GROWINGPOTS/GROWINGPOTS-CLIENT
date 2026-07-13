import {
  CARD_BASE_CLASS,
  CARD_LOGO_CONFIG,
  LEVEL_STYLES,
  LOGO_COLOR_BY_LEVEL,
  ProgressLevel,
} from '@features/main/constants/progress-grid';
import { REQUIREMENT_UNIT_LABELS } from '@features/main/constants/requirement';
import type { GraduationProgressItem } from '@features/main/types/progress-grid';
import type { RequirementAccordionItem } from '@features/main/types/requirement';
import type { GraduationResponse } from '@shared/apis/types/graduation';
import { cn } from '@shared/utils/cn';

const PROGRESS_ITEM_META: Record<string, Pick<GraduationProgressItem, 'id' | 'title'>> = {
  MAJOR_BASIC: { id: 'major-basic', title: '전공기초' },
  MAJOR_REQUIRED: { id: 'major-required', title: '전공필수' },
  MAJOR_ELECTIVE: { id: 'major-elective', title: '전공선택' },
  REQUIRED_GE: { id: 'required-courses', title: '필수교과' },
  DISTRIBUTED_GE: { id: 'distribution-courses', title: '배분이수교과' },
  FREE_GE: { id: 'free-courses', title: '자유이수교과' },
  SW_CERT_COURSE: { id: 'sw-certification', title: 'SW인증과목' },
  ENGLISH_COURSE: { id: 'english-class', title: '영어 강의' },
};

const PROGRESS_ITEM_ORDER = [
  'MAJOR_BASIC',
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'REQUIRED_GE',
  'DISTRIBUTED_GE',
  'FREE_GE',
  'SW_CERT_COURSE',
  'ENGLISH_COURSE',
] as const;

const getTotalCurrentCredits = (shortcuts: RequirementAccordionItem[]) => {
  return shortcuts.reduce((total, { current, unit }) => {
    if (unit !== 'CREDITS') return total;

    return total + current;
  }, 0);
};

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

export const getProgressGridItems = (
  shortcuts: RequirementAccordionItem[],
  totalCredits: GraduationResponse['summary']['totalCredits'],
): GraduationProgressItem[] => {
  const shortcutMap = new Map(shortcuts.map((item) => [item.code, item]));
  const totalCurrentCredits = getTotalCurrentCredits(shortcuts);
  const requirementItems = PROGRESS_ITEM_ORDER.map((code) => {
    const item = shortcutMap.get(code);
    const meta = PROGRESS_ITEM_META[code];
    const unitLabel = item ? (REQUIREMENT_UNIT_LABELS[item.unit] as GraduationProgressItem['unit']) : '학점';

    return {
      ...meta,
      current: item?.current ?? 0,
      required: item?.required ?? 0,
      unit: unitLabel,
      scrollKey: item?.scrollKey,
      isConditionCheckRequired: item
        ? item.required !== null && item.current >= item.required && !item.satisfied
        : false,
    };
  });

  return [
    ...requirementItems,
    {
      id: 'total-credit',
      title: '총학점',
      current: totalCurrentCredits,
      required: totalCredits.required,
      isTotal: true,
    },
  ];
};
