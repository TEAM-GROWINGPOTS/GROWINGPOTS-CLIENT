'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useViewMode } from '../hooks/use-view-mode';

export type ViewMode = 'card' | 'roadmap';

interface ViewModeOption {
  value: ViewMode;
  label: string;
  icon: string;
}

const OPTIONS: ViewModeOption[] = [
  { value: 'card', label: '목록 보기', icon: 'ic_list' },
  { value: 'roadmap', label: '로드맵 보기', icon: 'ic_roadmap' },
];

export const ViewModeToggle = () => {
  const { viewMode: value, setViewMode: onChange } = useViewMode();
  const buttonRefs = useRef<Record<ViewMode, HTMLButtonElement | null>>({ card: null, roadmap: null });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  useLayoutEffect(() => {
    const button = buttonRefs.current[value];

    if (button) {
      setIndicatorStyle({ left: button.offsetLeft, width: button.offsetWidth });
    }
  }, [value]);

  useEffect(() => {
    const frameIds: number[] = [];

    frameIds.push(
      requestAnimationFrame(() => {
        frameIds.push(requestAnimationFrame(() => setIsTransitionEnabled(true)));
      }),
    );

    return () => {
      frameIds.forEach(cancelAnimationFrame);
    };
  }, []);

  return (
    <div role="tablist" aria-label="화면 보기 방식" className="relative inline-flex shrink-0 rounded-full bg-white p-4">
      <div
        className={cn(
          'absolute top-4 bottom-4 rounded-full bg-gray-800',
          isTransitionEnabled && 'transition-[left,width] duration-200 ease-out',
        )}
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {OPTIONS.map(({ value: optionValue, label, icon }) => {
        const isSelected = optionValue === value;

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
            onClick={() => onChange(optionValue)}
            className={cn(
              'text-body-m-14 relative flex shrink-0 cursor-pointer items-center gap-8 rounded-full px-12 py-8 whitespace-nowrap',
              isTransitionEnabled && 'transition-colors duration-200 ease-out',
              isSelected ? 'text-gray-100' : 'text-gray-500',
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
