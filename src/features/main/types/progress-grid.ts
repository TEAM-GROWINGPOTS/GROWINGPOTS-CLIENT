export type GraduationProgressUnit = '학점' | '과목';

export interface GraduationProgressItem {
  id: string;
  title: string;
  current: number;
  required: number;
  unit?: GraduationProgressUnit;
  isTotal?: boolean;
  isConditionCheckRequired?: boolean;
  scrollKey?: string;
}

export interface GraduationProgressGridProps {
  items?: GraduationProgressItem[];
  selectedItemId?: string;
  onSelectItem?: (item: GraduationProgressItem) => void;
  className?: string;
}

export interface LegendDotProps {
  colorClassName: string;
  label: string;
}
