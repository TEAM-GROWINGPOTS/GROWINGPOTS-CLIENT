'use client';

import { DEFAULT_ITEMS } from '@features/main/constants/progress-grid';
import { GraduationProgressGridProps, LegendDotProps } from '@features/main/types/progress-grid';
import {
  getCardClass,
  getCardLogoDetails,
  getProgressLevel,
  getTotalShapeClasses,
  isCompleted,
} from '@features/main/utils/progress-grid';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

export const GraduationProgressGrid = ({
  items = DEFAULT_ITEMS,
  selectedItemId,
  onSelectItem,
  className,
}: GraduationProgressGridProps) => {
  return (
    <section
      className={cn('flex h-545 w-full flex-col gap-28 overflow-visible', className)}
      aria-label="졸업 이수 현황"
    >
      <div className="grid w-full grid-cols-[129fr_166fr_213fr] gap-4 overflow-visible pr-12">
        {items.map((item, index) => {
          const isSelected = selectedItemId === item.id;
          const isSecondRow = Math.floor(index / 3) === 1;
          const isDisabled = item.isDisabled || !item.scrollKey;

          const level = getProgressLevel(item);
          const isDone = level === 3;
          const logo = getCardLogoDetails(item, level);
          const hasAlert = item.isConditionCheckRequired;

          return (
            <button
              key={item.id}
              type="button"
              className={getCardClass(item, level, isSelected, isSecondRow, isDisabled)}
              onClick={() => {
                if (isDisabled) return;
                onSelectItem?.(item);
              }}
              disabled={isDisabled}
              aria-pressed={isSelected}
            >
              {item.isTotal && (
                <span className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                  <svg
                    className={cn(
                      'block size-full transition-colors duration-300 ease-in-out',
                      getTotalShapeClasses(level).base,
                      !isDisabled && getTotalShapeClasses(level).hover,
                    )}
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 225 162"
                  >
                    <path
                      d="M0 20C0 8.95431 8.9543 0 20 0H159.78C166.306 0 172.422 3.18387 176.164 8.52992L223.172 75.6769C228.376 83.1101 227.924 93.1151 222.071 100.049L176.185 154.402C172.385 158.903 166.794 161.5 160.903 161.5H20C8.95433 161.5 0 152.546 0 141.5V20Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              )}

              <div className="relative z-10 flex w-full flex-col items-start gap-2">
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      'text-body-m-14 whitespace-nowrap transition-colors duration-300 ease-in-out',
                      isDone ? 'text-gray-100' : 'text-gray-600',
                    )}
                  >
                    {item.title}
                  </span>
                  {hasAlert && <Icon name="ic_alert_circle" size={20} aria-label={`${item.title} 조건 확인 필요`} />}
                  {!hasAlert && isCompleted(item) && (
                    <Icon name="ic_check_circle" size={20} aria-label={`${item.title} 충족`} />
                  )}
                </div>
                {hasAlert && (
                  <p className="text-caption-r-12 text-dark-red-10 group-hover:text-red-20 transition-colors duration-300 ease-in-out">
                    *조건 확인 필요
                  </p>
                )}
              </div>

              <div className="relative z-10 flex h-37 items-center">
                <span
                  className={cn(
                    'text-title-sb-24 relative bottom-3 transition-colors duration-300 ease-in-out',
                    isDone ? 'text-gray-50' : 'text-gray-800',
                  )}
                >
                  {item.current}
                </span>
                <span
                  className={cn(
                    'text-body-m-14 px-1 transition-colors duration-300 ease-in-out',
                    level === 2 ? 'text-lime-700' : 'text-gray-400',
                  )}
                >
                  /{item.required}
                  {item.unit ?? '학점'}
                </span>
              </div>

              {logo && (
                <Icon
                  name={logo.name}
                  width={logo.size.width}
                  height={logo.size.height}
                  className={cn('pointer-events-none absolute', logo.positionClass, logo.colorClass)}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-full overflow-hidden pb-12">
        <div className="inline-flex items-center gap-12 rounded-[36px] bg-gray-50 px-12 py-8">
          <LegendDot colorClassName="bg-lime-400" label="미충족" />
          <LegendDot colorClassName="bg-gray-700" label="충족" />
        </div>
      </div>
    </section>
  );
};

const LegendDot = ({ colorClassName, label }: LegendDotProps) => (
  <div className="flex items-center justify-center gap-8">
    <span className={cn('size-16 rounded-full', colorClassName)} />
    <span className="text-body-m-14 text-gray-500">{label}</span>
  </div>
);
