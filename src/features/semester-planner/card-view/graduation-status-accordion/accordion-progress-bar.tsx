import { cn } from '@shared/utils/cn';

import { calculatePercentage } from './calculate-percentage';

interface AccordionProgressBarProps {
  current: number;
  required: number;
  className?: string;
}

export const AccordionProgressBar = ({ current, required, className }: AccordionProgressBarProps) => {
  const percentage = calculatePercentage(current, required);
  return (
    <div className={cn('h-12 w-full overflow-hidden bg-gray-200', className)}>
      <div className="animate-progress-fill h-full origin-left bg-lime-400" style={{ width: `${percentage}%` }} />
    </div>
  );
};
