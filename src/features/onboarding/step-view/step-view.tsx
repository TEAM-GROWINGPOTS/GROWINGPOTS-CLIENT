'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

type StepViewUnit = '학점' | '과목';

export interface StepViewItem {
  id: string;
  title: string;
  current: number;
  required: number;
  unit?: StepViewUnit;
  satisfied: boolean;
  isTotal?: boolean;
}

interface StepViewProps {
  items?: StepViewItem[];
  selectedItemId?: string;
  onSelectItem?: (item: StepViewItem) => void;
  className?: string;
}

const DEFAULT_ITEMS: StepViewItem[] = [
  { id: 'major-basic', title: '전공기초', current: 12, required: 10, satisfied: true },
  { id: 'major-required', title: '전공필수', current: 15, required: 17, satisfied: false },
  { id: 'major-elective', title: '전공선택', current: 27, required: 42, satisfied: false },
  { id: 'required-courses', title: '필수교과', current: 15, required: 17, satisfied: false },
  { id: 'distribution-courses', title: '배분이수교과', current: 12, required: 12, satisfied: true },
  { id: 'free-courses', title: '자유이수교과', current: 11, required: 3, satisfied: true },
  { id: 'sw-certification', title: 'SW인증과목', current: 6, required: 6, satisfied: true },
  { id: 'english-class', title: '영어 강의', current: 4, required: 3, unit: '과목', satisfied: true },
  { id: 'total-credit', title: '총학점', current: 80, required: 120, satisfied: false, isTotal: true },
];

const cardBaseClassName =
  'relative flex h-160 flex-col justify-between overflow-hidden rounded-[20px] px-20 pb-8 pt-20';

const shortCardIds = new Set(['required-courses', 'distribution-courses', 'free-courses']);

const getCardClassName = (item: StepViewItem, isSelected: boolean) =>
  cn(
    cardBaseClassName,
    shortCardIds.has(item.id) && 'h-140',
    item.satisfied ? 'bg-gray-700' : 'bg-lime-300',
    item.isTotal && 'bg-transparent',
    isSelected && 'ring-2 ring-lime-500 ring-offset-2 ring-offset-gray-100',
  );

const getTitleClassName = (item: StepViewItem) =>
  item.satisfied ? 'text-body-m-14 text-gray-100' : 'text-body-m-14 text-gray-600';

const getValueClassName = (item: StepViewItem) =>
  item.satisfied ? 'text-title-sb-24 text-gray-50' : 'text-title-sb-24 text-gray-800';

const getRequiredClassName = (item: StepViewItem) =>
  item.satisfied ? 'px-2 text-body-m-14 text-gray-400' : 'text-body-m-14 text-lime-700';

const getUnit = (unit?: StepViewUnit) => unit ?? '학점';

export const StepView = ({ items = DEFAULT_ITEMS, selectedItemId, onSelectItem, className }: StepViewProps) => {
  return (
    <section className={cn('flex h-545 w-528 flex-col gap-28', className)} aria-label="졸업 요건 step view">
      <div className="grid w-full grid-cols-[129px_minmax(0,1fr)_213px] gap-4 pr-12">
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={getCardClassName(item, isSelected)}
              onClick={() => onSelectItem?.(item)}
              aria-pressed={isSelected}
            >
              {item.isTotal && (
                <span className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 225 162">
                    <path
                      d="M0 20C0 8.95431 8.9543 0 20 0H159.78C166.306 0 172.422 3.18387 176.164 8.52992L223.172 75.6769C228.376 83.1101 227.924 93.1151 222.071 100.049L176.185 154.402C172.385 158.903 166.794 161.5 160.903 161.5H20C8.95433 161.5 0 152.546 0 141.5V20Z"
                      fill="#EDFF98"
                    />
                  </svg>
                </span>
              )}

              <div className="relative z-10 flex items-center gap-4">
                <span className={getTitleClassName(item)}>{item.title}</span>
                {item.satisfied && !item.isTotal && (
                  <Icon name="ic_check_circle.color" size={20} aria-label={`${item.title} 충족`} />
                )}
              </div>

              <div className="relative z-10 flex items-end">
                <span className={cn(getValueClassName(item), 'relative top-2')}>{item.current}</span>
                <span className={getRequiredClassName(item)}>
                  /{item.required}
                  {getUnit(item.unit)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-full overflow-hidden pb-12">
        <div className="inline-flex items-center gap-12 rounded-[36px] bg-gray-50 px-12 py-8">
          <LegendDot colorClassName="bg-lime-500" label="미충족" />
          <LegendDot colorClassName="bg-gray-700" label="충족" />
        </div>
      </div>
    </section>
  );
};

interface LegendDotProps {
  colorClassName: string;
  label: string;
}

const LegendDot = ({ colorClassName, label }: LegendDotProps) => (
  <div className="flex items-center justify-center gap-8">
    <span className={cn('size-16 rounded-full', colorClassName)} />
    <span className="text-body-m-14 text-gray-500">{label}</span>
  </div>
);
