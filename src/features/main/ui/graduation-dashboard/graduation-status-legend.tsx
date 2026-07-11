import { cn } from '@shared/utils/cn';

const LEGEND_ITEMS = [
  { label: '미충족', colorClassName: 'bg-lime-400' },
  { label: '충족', colorClassName: 'bg-gray-700' },
];

export const GraduationStatusLegend = () => {
  return (
    <ul className="flex w-fit items-center gap-12 rounded-full bg-gray-50 px-12 py-8" aria-label="졸업요건 상태 범례">
      {LEGEND_ITEMS.map(({ label, colorClassName }) => (
        <li key={label} className="flex items-center gap-8">
          <span className={cn('size-16 rounded-full', colorClassName)} aria-hidden />
          <span className="text-body-m-14 text-gray-500">{label}</span>
        </li>
      ))}
    </ul>
  );
};
