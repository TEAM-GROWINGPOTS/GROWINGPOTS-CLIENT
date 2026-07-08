import { Badge } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type ClassCardType = 'default' | 'disabled';

const classCardVariants = cva('flex w-auto flex-col items-start rounded-sm bg-white px-16 py-12', {
  variants: {
    type: {
      default: '',
      disabled: 'relative',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

const getTagColor = (tag: string) => {
  if (tag.startsWith('전공')) return 'lime01';
  if (tag.startsWith('교양')) return 'purple';
  return 'blue';
};

interface ClassCardProps extends Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  department: string;
  title: string;
  tags: string[];
  type?: ClassCardType;
}

export const ClassCard = ({ department, title, tags, type = 'default', className, ...props }: ClassCardProps) => {
  return (
    <article className={cn(classCardVariants({ type }), className)} {...props}>
      <span className="text-caption-m-10 mb-2 text-gray-400">{department}</span>
      <h3 className="text-body-sb-16 w-full truncate text-gray-900">
        {title}
        {type === 'disabled' && <span className="sr-only">(비활성)</span>}
      </h3>
      {tags.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-4">
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
