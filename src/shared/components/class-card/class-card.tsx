'use client';

import { Badge, Tooltip } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef, useState } from 'react';

export type ClassCardType = 'default' | 'disabled';
export type ClassCardSize = 'default' | 'max';

const classCardVariants = cva('flex w-auto flex-col items-start rounded-sm bg-white p-14', {
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
  const normalizedTag = tag.replace(/\s/g, '');

  if (normalizedTag === '졸업필수') return 'lime01';
  if (normalizedTag.startsWith('전공')) return 'lime01';
  if (GENERAL_EDUCATION_DIVISIONS.includes(normalizedTag)) return 'purple';
  return 'blue';
};

const getNote = (isEnglish: boolean, isSw: boolean) => {
  if (isEnglish && isSw) return '*영어·SW인증영역';
  if (isEnglish) return '*영어영역';
  if (isSw) return '*SW인증영역';
  return undefined;
};

const getCombinedNote = (customNote: string | undefined, defaultNote: string | undefined) => {
  if (!customNote) return defaultNote;
  if (!defaultNote) return customNote;
  return `${customNote} / ${defaultNote.replace(/^\*/, '')}`;
};

interface ClassCardProps extends Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  department?: string;
  title: string;
  tags: string[];
  note?: string;
  isEnglish?: boolean;
  isSw?: boolean;
  type?: ClassCardType;
  size?: ClassCardSize;
}

export const ClassCard = ({
  department,
  title,
  tags,
  note: customNote,
  isEnglish = false,
  isSw = false,
  type = 'default',
  size = 'default',
  className,
  ...props
}: ClassCardProps) => {
  const note = getCombinedNote(customNote, getNote(isEnglish, isSw));
  const visibleTags = tags.filter(Boolean);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (el) setIsTitleTruncated(el.scrollWidth > el.clientWidth);
  }, [title]);

  return (
    <article className={cn(classCardVariants({ type, size }), className)} {...props}>
      {department && !isSw && <span className="text-caption-m-10 mb-2 text-gray-400">{department}</span>}
      <Tooltip
        content={title}
        variant="bottom-start"
        disabled={!isTitleTruncated}
        trigger={
          <h3 ref={titleRef} className="text-body-sb-16 w-full cursor-default truncate text-gray-900">
            {title}
            {type === 'disabled' && <span className="sr-only">(비활성)</span>}
          </h3>
        }
      />
      {note && <span className="text-caption-m-10 text-red-20">{note}</span>}
      {visibleTags.length > 0 && (
        <div className={cn('flex flex-wrap items-center gap-4', size === 'max' ? 'mt-auto pt-12' : 'mt-12')}>
          {visibleTags.map((tag, index) => {
            const shouldTruncate = index === 0;
            return (
              <Badge
                key={`${tag}-${index}`}
                size="xsmall"
                variant="primary"
                color={shouldTruncate ? getTagColor(tag) : 'gray'}
                truncate={shouldTruncate}
                tooltipOnTruncate={shouldTruncate}
                tooltipContent={tag}
                className={cn('cursor-default', shouldTruncate && 'max-w-70')}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      )}
      {type === 'disabled' && <div className="bg-white-50 absolute inset-0 rounded-[inherit]" />}
    </article>
  );
};
