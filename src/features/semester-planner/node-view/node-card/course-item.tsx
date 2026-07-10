'use client';

import { Badge, Tooltip } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { useLayoutEffect, useRef, useState } from 'react';

import type { NodeCardCourse } from './node-card';

const MAJOR_DIVISION_CATEGORIES = ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_BASIC'];

interface CourseItemProps {
  course: NodeCardCourse;
}

export const CourseItem = ({ course }: CourseItemProps) => {
  const isMajor = course.divisionCategory !== null && MAJOR_DIVISION_CATEGORIES.includes(course.divisionCategory);

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.clientWidth);
  }, [course.courseName]);

  return (
    <div className="flex h-44 items-center justify-between rounded-sm border border-gray-100 bg-white px-10">
      <Tooltip
        trigger={
          <p ref={textRef} className={cn('text-body-m-14 min-w-0 flex-1 truncate text-gray-700')}>
            {course.courseName}
          </p>
        }
        content={course.courseName}
        variant="top-start"
        disabled={!isTruncated}
      />
      {isMajor && course.divisionName && (
        <Badge size="xsmall" color="lime02" className="ml-8 shrink-0">
          {course.divisionName}
        </Badge>
      )}
    </div>
  );
};
