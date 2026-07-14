import { cn } from '@shared/utils/cn';

interface ProgressBarProps {
  current: number;
  required: number;
  satisfied: boolean;
  className?: string;
}

export const ProgressBar = ({ current, required, satisfied, className }: ProgressBarProps) => {
  const percent = required > 0 ? Math.min(Math.max((current / required) * 100, 0), 100) : 0;

  return (
    <div className={cn('h-6 overflow-hidden rounded-lg bg-white', className)}>
      <div
        className={cn('animate-progress-fill h-full origin-left rounded-lg', satisfied ? 'bg-gray-700' : 'bg-gray-300')}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
