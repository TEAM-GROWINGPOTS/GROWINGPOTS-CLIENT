'use client';

import { TableCellEdit, TableCellSelect } from '@features/onboarding/table-cell';
import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { useEffect, useState } from 'react';

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
  isEditing?: boolean;
}

const departmentOptions = ['해당없음', '연극영화학과', '컴퓨터공학부', '후마니타스칼리지(국제)'].map((label) => ({
  value: label,
  label,
}));

const semesterOptions = Array.from({ length: 8 }, (_, i) => `${i + 1}학기`).map((label) => ({
  value: label,
  label,
}));

const areaOptions = ['필수교과', '전공 기초', '전공 필수', '전공 선택'].map((label) => ({ value: label, label }));

const columns = [
  { key: 'courseName', label: '과목명', type: 'text' },
  { key: 'department', label: '개설학부', type: 'select', options: departmentOptions },
  { key: 'credit', label: '학점', type: 'text', suffix: '학점' },
  { key: 'semester', label: '이수학기', type: 'select', options: semesterOptions },
  { key: 'area', label: '영역', type: 'select', options: areaOptions },
] as const;

const toCreditValue = (value: string) =>
  value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/(\.\d).+/, '$1');

const ROW_HEIGHT = 44;
const DEFAULT_VISIBLE_ROWS = 3;

export const CourseInfoTable = ({ courses, isEditing = false }: CourseInfoTableProps) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(DEFAULT_VISIBLE_ROWS, courses.length));
  const [rows, setRows] = useState(courses);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);

  if (isEditing !== prevIsEditing) {
    setPrevIsEditing(isEditing);
    if (!isEditing) setSelectedIds(new Set());
  }

  useEffect(() => {
    if (expanded || courses.length === 0) return;

    const updateVisibleCount = () => {
      const overflow = document.body.scrollHeight - window.innerHeight;

      setVisibleCount((prev) => {
        if (overflow > 0) return Math.max(1, prev - Math.ceil(overflow / ROW_HEIGHT));
        if (overflow <= -ROW_HEIGHT) return Math.min(courses.length, prev + Math.floor(-overflow / ROW_HEIGHT));
        return prev;
      });
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [courses.length, expanded, visibleCount]);

  const visibleCourses = expanded || isEditing ? rows : rows.slice(0, visibleCount);
  const canToggle = !isEditing && (expanded || rows.length > visibleCount);
  const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;

  const handleToggleClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleCellChange = (id: string, key: (typeof columns)[number]['key']) => (value: string) => {
    const nextValue = key === 'credit' ? toCreditValue(value) : value;
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: nextValue } : row)));
  };

  const handleSelectAllClick = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(rows.map((row) => row.id)));
  };

  const handleRowSelectClick = (id: string) => () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="flex flex-col gap-18 rounded-lg bg-white px-24 py-20">
      <p className="text-body-sb-16 text-gray-600">과목정보</p>
      <div className="flex flex-col items-center gap-19">
        <div className="flex w-full flex-col gap-10">
          <div className="flex gap-16 bg-gray-50 px-8 py-4">
            {isEditing && (
              <button type="button" onClick={handleSelectAllClick} className="shrink-0" aria-label="전체 선택">
                <Icon name={isAllSelected ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} />
              </button>
            )}
            {columns.map(({ key, label }) => (
              <p key={key} className="text-body-sb-16 flex flex-1 px-8 py-4 text-gray-600">
                {label}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {visibleCourses.map((course) => (
              <div key={course.id} className="flex gap-16 px-8 py-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleRowSelectClick(course.id)}
                    className="shrink-0"
                    aria-label={`${course.courseName} 선택`}
                  >
                    <Icon
                      name={selectedIds.has(course.id) ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'}
                      size={20}
                    />
                  </button>
                )}
                {columns.map((column) =>
                  isEditing && column.type === 'select' ? (
                    <TableCellSelect
                      key={column.key}
                      options={column.options}
                      value={course[column.key]}
                      onChange={handleCellChange(course.id, column.key)}
                      className="flex-1"
                    />
                  ) : (
                    <TableCellEdit
                      key={column.key}
                      mode={isEditing ? 'edit' : 'view'}
                      value={course[column.key]}
                      onChange={handleCellChange(course.id, column.key)}
                      className="flex-1"
                      suffix={'suffix' in column ? column.suffix : undefined}
                    />
                  ),
                )}
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
