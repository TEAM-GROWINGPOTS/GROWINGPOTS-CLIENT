'use client';

import { useViewMode } from '@features/semester-planner/hooks/use-view-mode';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useLayoutEffect, useRef, useState } from 'react';

export type ViewMode = 'card' | 'roadmap';

interface ViewModeOption {
  value: ViewMode;
  label: string;
  icon: string;
}

interface IndicatorStyle {
  left: number;
  width: number;
}

const OPTIONS: ViewModeOption[] = [
  { value: 'card', label: '목록 보기', icon: 'ic_list' },
  { value: 'roadmap', label: '로드맵 보기', icon: 'ic_roadmap' },
];

export const ViewModeToggle = () => {
  const { viewMode: value, setViewMode } = useViewMode();

  const buttonRefs = useRef<Record<ViewMode, HTMLButtonElement | null>>({ card: null, roadmap: null });
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(null);

  useLayoutEffect(() => {
    const button = buttonRefs.current[value];

    if (button) {
      setIndicatorStyle({ left: button.offsetLeft, width: button.offsetWidth });
    }
  }, [value]);

  return (
    <div role="tablist" aria-label="화면 보기 방식" className="relative inline-flex shrink-0 rounded-full bg-white p-4">
      {indicatorStyle && (
        <div
          className="absolute top-4 bottom-4 rounded-full bg-gray-800 transition-[left,width] duration-200 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      )}
      {OPTIONS.map(({ value: optionValue, label, icon }) => {
        const isSelected = optionValue === value;
        const needsFallbackBg = isSelected && !indicatorStyle;

        return (
          <button
            key={optionValue}
            ref={(el) => {
              buttonRefs.current[optionValue] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={label}
            onClick={() => setViewMode(optionValue)}
            className={cn(
              'text-body-m-14 relative flex shrink-0 cursor-pointer items-center gap-8 rounded-full px-12 py-8 whitespace-nowrap transition-colors duration-200 ease-out',
              isSelected ? 'text-gray-100' : 'text-gray-500',
              needsFallbackBg && 'bg-gray-800',
            )}
          >
            <Icon name={icon} size={20} className={isSelected ? 'text-gray-50' : undefined} />
            {isSelected && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
};
