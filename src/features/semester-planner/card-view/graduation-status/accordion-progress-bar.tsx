import { cn } from '@shared/utils/cn';

interface AccordionProgressBarProps {
  current: number;
  required: number;
  className?: string;
}

export const AccordionProgressBar = ({ current, required, className }: AccordionProgressBarProps) => {
  const percentage = required > 0 ? Math.min((current / required) * 100, 100) : 0;
  return (
    <div className={cn('h-12 w-full overflow-hidden bg-gray-200', className)}>
      <div className="animate-progress-fill h-full origin-left bg-lime-400" style={{ width: `${percentage}%` }} />
    </div>
  );
};
