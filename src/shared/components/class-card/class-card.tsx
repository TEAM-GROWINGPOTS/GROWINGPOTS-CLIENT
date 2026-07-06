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
      <h3 className="text-body-sb-16 text-gray-900">
        {title}
        {type === 'disabled' && <span className="sr-only">(비활성)</span>}
      </h3>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        {tags.map((tag, index) => (
          <Badge
            key={tag}
            size="xsmall"
            variant={index == 0 ? 'primary' : 'disabled'}
            color={index == 0 ? 'lime01' : null}
          >
            {tag}
          </Badge>
        ))}
      </div>
      {type === 'disabled' && <div className="bg-white-50 absolute inset-0 rounded-[inherit]" />}
    </article>
  );
};
