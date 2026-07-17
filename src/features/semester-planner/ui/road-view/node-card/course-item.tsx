'use client';

import { getDivisionCategoryBadgeColor } from '@features/semester-planner/constants';
import type { NodeCardCourse } from '@features/semester-planner/types/planner-node';
import { Badge, Tooltip } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { useLayoutEffect, useRef, useState } from 'react';

interface CourseItemProps {
  course: NodeCardCourse;
}

export const CourseItem = ({ course }: CourseItemProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // 과목명이 길어져서 줄임표시가 되는 경우 → 툴팁 표시
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
        variant="bottom-start"
        disabled={!isTruncated}
      />
      {course.divisionCategory && course.divisionName && (
        <Badge size="xsmall" color={getDivisionCategoryBadgeColor(course.divisionCategory)} className="ml-8 shrink-0">
          {course.divisionName}
        </Badge>
      )}
    </div>
  );
};
