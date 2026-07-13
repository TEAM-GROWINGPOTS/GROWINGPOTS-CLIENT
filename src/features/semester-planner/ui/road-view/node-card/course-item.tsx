'use client';

import type { MajorDivisionCategoryTypes, NodeCardCourse } from '@features/semester-planner/types/planner-node';
import { Badge, Tooltip } from '@shared/components';
import { cn } from '@shared/utils/cn';
import { useLayoutEffect, useRef, useState } from 'react';

const MAJOR_DIVISION_CATEGORY_SET: Set<string> = new Set<MajorDivisionCategoryTypes>([
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'MAJOR_BASIC',
]);

// 교양 계열(GENERAL 및 하위 필수/배분이수/자유이수교과) → purple, 기타(GENERAL_ELECTIVE) → blue
const GENERAL_EDUCATION_DIVISION_CATEGORY_SET = new Set(['GENERAL', 'REQUIRED_GE', 'DISTRIBUTED_GE', 'FREE_GE']);

// 전공 → lime02, 교양 → purple, 그 외(기타) → blue
const getDivisionBadgeColor = (divisionCategory: string): 'lime02' | 'purple' | 'blue' => {
  if (MAJOR_DIVISION_CATEGORY_SET.has(divisionCategory)) return 'lime02';
  if (GENERAL_EDUCATION_DIVISION_CATEGORY_SET.has(divisionCategory)) return 'purple';
  return 'blue';
};

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
        <Badge size="xsmall" color={getDivisionBadgeColor(course.divisionCategory)} className="ml-8 shrink-0">
          {course.divisionName}
        </Badge>
      )}
    </div>
  );
};
