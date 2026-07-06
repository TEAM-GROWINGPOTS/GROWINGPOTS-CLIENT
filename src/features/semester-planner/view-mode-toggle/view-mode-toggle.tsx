'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

export type ViewMode = 'card' | 'roadmap';

const OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'card', label: '목록 보기', icon: 'ic_list' },
  { value: 'roadmap', label: '로드맵 보기', icon: 'ic_roadmap' },
];

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export const ViewModeToggle = ({ value, onChange }: ViewModeToggleProps) => {
  return (
    <div className={'flex rounded-full bg-white p-4'}>
      {OPTIONS.map(({ value: optionValue, label, icon }) => {
        const isSelected = optionValue === value;

        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={isSelected}
            aria-label={label}
            onClick={() => onChange(optionValue)}
            className={cn(
              'text-body-m-14 flex gap-8 rounded-full px-12 py-8',
              isSelected ? 'bg-gray-700 text-gray-100' : 'text-gray-500',
            )}
          >
            <Icon name={icon} size={20} />
            {isSelected && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
};
