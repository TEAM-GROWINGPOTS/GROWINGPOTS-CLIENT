'use client';

import { TableCellEdit } from '@features/onboarding/table-cell';
import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { useEffect, useRef, useState } from 'react';

export interface CourseInfo {
  id: string;
  courseName: string;
  department: string;
  credit: string;
  semester: string;
  area: string;
}

interface CourseInfoTableProps {
  courses: CourseInfo[];
}

const columns = [
  { key: 'courseName', label: '과목명' },
  { key: 'department', label: '개설학부' },
  { key: 'credit', label: '학점' },
  { key: 'semester', label: '이수학기' },
  { key: 'area', label: '영역' },
] as const;

const ROW_HEIGHT = 44;
const FOOTER_RESERVED_HEIGHT = 90;
const DEFAULT_VISIBLE_ROWS = 3;

export const CourseInfoTable = ({ courses }: CourseInfoTableProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(DEFAULT_VISIBLE_ROWS, courses.length));

  useEffect(() => {
    const updateVisibleCount = () => {
      const el = listRef.current;
      if (!el) return;

      const availableHeight = window.innerHeight - el.getBoundingClientRect().top - FOOTER_RESERVED_HEIGHT;
      const rowsThatFit = Math.floor(availableHeight / ROW_HEIGHT);

      setVisibleCount(Math.min(courses.length, Math.max(1, rowsThatFit)));
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [courses.length]);

  const visibleCourses = expanded ? courses : courses.slice(0, visibleCount);
  const canToggle = expanded || courses.length > visibleCount;

  const handleToggleClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <section className="flex flex-col gap-18 rounded-lg bg-white px-24 py-20">
      <p className="text-body-sb-16 text-gray-600">과목정보</p>
      <div className="flex flex-col items-center gap-19">
        <div className="flex w-full flex-col gap-10">
          <div className="flex gap-16 bg-gray-50 px-8 py-4">
            {columns.map(({ key, label }) => (
              <p key={key} className="text-body-sb-16 flex flex-1 px-8 py-4 text-gray-600">
                {label}
              </p>
            ))}
          </div>
          <div ref={listRef} className="flex flex-col gap-4">
            {visibleCourses.map((course) => (
              <div key={course.id} className="flex gap-16 px-8 py-4">
                {columns.map(({ key }) => (
                  <TableCellEdit key={key} mode="view" value={course[key]} onChange={() => {}} className="flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
        {canToggle && (
          <Button
            icon={<Icon name="ic_chevron_down" size={16} className={expanded ? 'rotate-180' : undefined} />}
            label={expanded ? '접기' : '전체 과목 보기'}
            mode="secondary_outline"
            size="sm"
            onClick={handleToggleClick}
          />
        )}
      </div>
    </section>
  );
};
