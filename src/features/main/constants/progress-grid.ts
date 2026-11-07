export type ProgressLevel = 1 | 2 | 3;

export interface LevelStyle {
  cardBackground: { base: string; hover: string };
  totalShape: { base: string; hover: string };
}

export interface CardLogoConfig {
  name: string;
  positionClass: string;
  size: { width: number; height: number };
}

export const CARD_BASE_CLASS =
  'group relative flex h-160 flex-col items-start justify-between overflow-hidden cursor-pointer rounded-[20px] px-20 pb-8 pt-20';

export const LEVEL_STYLES: Record<ProgressLevel, LevelStyle> = {
  1: {
    cardBackground: { base: 'bg-lime-100', hover: 'hover:bg-lime-200' },
    totalShape: { base: 'text-lime-100', hover: 'group-hover:text-lime-200' },
  },
  2: {
    cardBackground: { base: 'bg-lime-300', hover: 'hover:bg-lime-400' },
    totalShape: { base: 'text-lime-300', hover: 'group-hover:text-lime-400' },
  },
  3: {
    cardBackground: { base: 'bg-gray-700', hover: 'hover:bg-gray-800' },
    totalShape: { base: 'text-gray-700', hover: 'group-hover:text-gray-800' },
  },
};

export const CARD_LOGO_CONFIG: Partial<Record<string, CardLogoConfig>> = {
  'major-required': {
    name: 'ic_logo_white',
    positionClass: 'right-22 bottom-11',
    size: { width: 75, height: 81 },
  },
  'sw-certification': {
    name: 'ic_logo_black',
    positionClass: 'right-22 bottom-11 rotate-[0.91deg]',
    size: { width: 58.095, height: 63.221 },
  },
};

export const LOGO_COLOR_BY_LEVEL: Partial<Record<ProgressLevel, string>> = {
  3: 'text-gray-600 transition-colors duration-300 ease-in-out group-hover:text-gray-700',
};
