import { Badge } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type ClassCardType = 'default' | 'disabled';

const classCardVariants = cva('flex w-auto flex-col items-start rounded-sm bg-white px-12 py-16', {
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
      <span className="text-caption-m-10 text-gray-400">{department}</span>
      <h3 className="text-body-sb-16 text-gray-900">{title}</h3>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        {tags.map((tag) => (
          <Badge key={tag} size="xsmall" variant="primary">
            {tag}
          </Badge>
        ))}
      </div>
      {type === 'disabled' && <div className="bg-white-50 absolute inset-0 rounded-[inherit]" />}
    </article>
  );
};
