import { Badge } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type ClassCardType = 'default' | 'disabled';
export type ClassCardSize = 'default' | 'max';

const classCardVariants = cva('flex w-auto flex-col items-start rounded-sm bg-white px-16 py-12', {
  variants: {
    type: {
      default: '',
      disabled: 'relative',
    },
    size: {
      default: '',
      max: 'h-116',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'default',
  },
});

const GENERAL_EDUCATION_DIVISIONS = ['필수교과', '배분이수교과', '자유이수교과'];

const getTagColor = (tag: string) => {
  if (tag.startsWith('전공')) return 'lime01';
  if (GENERAL_EDUCATION_DIVISIONS.includes(tag)) return 'purple';
  return 'blue';
};

const getNote = (isEnglish: boolean, isSw: boolean) => {
  if (isEnglish && isSw) return '*영어·SW인증영역';
  if (isEnglish) return '*영어영역';
  if (isSw) return '*SW인증영역';
  return undefined;
};

interface ClassCardProps extends Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  department?: string;
  title: string;
  tags: string[];
  isEnglish?: boolean;
  isSw?: boolean;
  type?: ClassCardType;
  size?: ClassCardSize;
}

export const ClassCard = ({
  department,
  title,
  tags,
  isEnglish = false,
  isSw = false,
  type = 'default',
  size = 'default',
  className,
  ...props
}: ClassCardProps) => {
  const note = getNote(isEnglish, isSw);

  return (
    <article className={cn(classCardVariants({ type, size }), className)} {...props}>
      {department && !isSw && <span className="text-caption-m-10 mb-2 text-gray-400">{department}</span>}
      <h3 className="text-body-sb-16 w-full truncate text-gray-900">
        {title}
        {type === 'disabled' && <span className="sr-only">(비활성)</span>}
      </h3>
      {note && <span className="text-caption-m-10 text-red-20">{note}</span>}
      {tags.length > 0 && (
        <div className={cn('flex flex-wrap items-center gap-4', size === 'max' ? 'mt-auto pt-12' : 'mt-12')}>
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              size="xsmall"
              variant="primary"
              color={index === 0 ? getTagColor(tag) : 'gray'}
              className={index === 0 ? 'max-w-70' : undefined}
            >
              {index === 0 ? <span className="truncate">{tag}</span> : tag}
            </Badge>
          ))}
        </div>
      )}
      {type === 'disabled' && <div className="bg-white-50 absolute inset-0 rounded-[inherit]" />}
    </article>
  );
};
