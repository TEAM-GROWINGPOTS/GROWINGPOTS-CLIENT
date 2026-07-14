'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { type TransitionEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TableCellEdit } from './table-cell/table-cell-edit';
import { TableCellSelect } from './table-cell/table-cell-select';

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
  onValidityChange?: (isValid: boolean) => void;
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

const toCreditValue = (value: string) => {
  const [integerPart = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.');
  const wholeNumber = integerPart.slice(0, 2);

  if (rest.length === 0) return wholeNumber;

  const half = rest.join('').replace(/[^5]/g, '').slice(0, 1);
  return `${wholeNumber}.${half}`;
};

const ROW_HEIGHT = 44;
const DEFAULT_VISIBLE_ROWS = 3;

export const CourseInfoTable = ({ courses, isEditing = false, onValidityChange }: CourseInfoTableProps) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(DEFAULT_VISIBLE_ROWS, courses.length));
  const [rows, setRows] = useState(courses);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
  const tableWrapperRef = useRef<HTMLTableElement>(null);
  const [tableHeight, setTableHeight] = useState<number>();
  const [isHeightTransitioning, setIsHeightTransitioning] = useState(false);
  const previousTableHeightRef = useRef<number | undefined>(undefined);

  if (isEditing !== prevIsEditing) {
    setPrevIsEditing(isEditing);
    if (!isEditing) {
      setSelectedIds(new Set());
      setExpanded(true);
    }
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

  const hasEmptyValue = rows.some((row) => row.courseName.trim() === '' || row.credit.trim() === '');

  useEffect(() => {
    onValidityChange?.(!hasEmptyValue);
  }, [hasEmptyValue, onValidityChange]);

  const visibleCourses = expanded || isEditing ? rows : rows.slice(0, visibleCount);
  const canToggle = !isEditing && (expanded || rows.length > visibleCount);
  const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;

  useLayoutEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const nextHeight = wrapper.scrollHeight;
    if (previousTableHeightRef.current !== undefined && previousTableHeightRef.current !== nextHeight) {
      setIsHeightTransitioning(true);
    }
    previousTableHeightRef.current = nextHeight;
    setTableHeight(nextHeight);
  }, [visibleCourses.length, isEditing]);

  const handleToggleClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleHeightTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'height') return;
    setIsHeightTransitioning(false);
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

  const handleDeleteClick = () => {
    setRows((prev) => prev.filter((row) => !selectedIds.has(row.id)));
    setSelectedIds(new Set());
  };

  return (
    <section className="flex flex-col gap-18 rounded-lg bg-white px-24 py-20">
      <div className="flex h-32 w-full items-center justify-between">
        <p className="text-body-sb-16 text-gray-600">과목정보</p>
        {isEditing && (
          <div className="flex items-center gap-12">
            <Button label="과목추가" mode="secondary_outline" size="sm" />
            <Button
              label="과목삭제"
              mode="primary_solid"
              size="sm"
              className="bg-gray-600 enabled:hover:bg-gray-700"
              disabled={selectedIds.size === 0}
              onClick={handleDeleteClick}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-19">
        <div
          className={cn(
            'w-full',
            isHeightTransitioning && 'overflow-hidden',
            tableHeight !== undefined && 'transition-[height] duration-300 ease-in-out',
          )}
          style={{ height: tableHeight }}
          onTransitionEnd={handleHeightTransitionEnd}
        >
          <table ref={tableWrapperRef} className="w-full table-fixed border-separate [border-spacing:0_4px]">
            <caption className="sr-only">과목 정보</caption>
            <colgroup>
              {isEditing && <col className="w-40" />}
              {columns.map(({ key }) => (
                <col key={key} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-gray-50">
                {isEditing && (
                  <th scope="col" className="px-8 py-4 text-left">
                    <button
                      type="button"
                      onClick={handleSelectAllClick}
                      aria-label="전체 선택"
                      className="flex size-20 items-center justify-center"
                    >
                      <Icon name={isAllSelected ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} />
                    </button>
                  </th>
                )}
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    scope="col"
                    className={cn(
                      'text-body-sb-16 truncate py-4 text-left text-gray-600',
                      isEditing ? 'px-16' : 'px-8',
                    )}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleCourses.map((course) => (
                <tr key={course.id}>
                  {isEditing && (
                    <td className="px-8 py-4 align-middle">
                      <button
                        type="button"
                        onClick={handleRowSelectClick(course.id)}
                        aria-label={`${course.courseName} 선택`}
                        className="flex size-20 items-center justify-center"
                      >
                        <Icon
                          name={selectedIds.has(course.id) ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'}
                          size={20}
                        />
                      </button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-8 py-4 align-middle">
                      {isEditing && column.type === 'select' ? (
                        <TableCellSelect
                          options={column.options}
                          value={course[column.key]}
                          onChange={handleCellChange(course.id, column.key)}
                        />
                      ) : (
                        <TableCellEdit
                          mode={isEditing ? 'edit' : 'view'}
                          value={course[column.key]}
                          onChange={handleCellChange(course.id, column.key)}
                          suffix={'suffix' in column ? column.suffix : undefined}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
