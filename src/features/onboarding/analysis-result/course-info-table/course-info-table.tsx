'use client';

import type { DepartmentResponse } from '@shared/apis/types/onboarding-options';
import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { AddCourseModal, type AddCourseValues, SEMESTER_OPTIONS } from '@shared/components/modal/add-course-modal';
import { ConfirmModal } from '@shared/components/modal/confirm-modal';
import { cn } from '@shared/utils/cn';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

import type { Division } from '../../types/course';
import { TableCellEdit } from './table-cell/table-cell-edit';
import { TableCellSelect } from './table-cell/table-cell-select';

export interface CourseInfo {
  id: string;
  courseId: number | null;
  courseName: string;
  department: string;
  departmentId: number | null;
  credit: string;
  semester: string;
  area: string;
  areaId: number | null;
}

interface CourseInfoTableProps {
  courses: CourseInfo[];
  departments: DepartmentResponse[];
  divisions: Division[];
  isEditing?: boolean;
  onValidityChange?: (isValid: boolean) => void;
  onDeleteRows?: (remainingCourses: CourseInfo[]) => void;
}

export interface CourseInfoTableRef {
  getCourses: () => CourseInfo[];
}

const toCreditValue = (value: string) => {
  const [integerPart = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.');
  const wholeNumber = integerPart.slice(0, 2);

  if (rest.length === 0) return wholeNumber;

  const half = rest.join('').replace(/[^5]/g, '').slice(0, 1);
  return `${wholeNumber}.${half}`;
};

const MIN_ROWS_TO_COLLAPSE = 3;
const MIN_COLLAPSED_HEIGHT = 44;

export const CourseInfoTable = forwardRef<CourseInfoTableRef, CourseInfoTableProps>(
  ({ courses, departments, divisions, isEditing = false, onValidityChange, onDeleteRows }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const [rows, setRows] = useState(courses);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openCellKey, setOpenCellKey] = useState<string | null>(null);
    const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const restOfPageHeightRef = useRef<number | undefined>(undefined);
    const [collapsedHeight, setCollapsedHeight] = useState<number>();

    const departmentOptions = [...departments.map(({ name }) => name).reverse(), '해당없음'].map((label) => ({
      value: label,
      label,
    }));

    const areaOptions = [...divisions.map(({ name }) => name).reverse(), '해당없음'].map((label) => ({
      value: label,
      label,
    }));

    const columns = [
      { key: 'courseName', label: '과목명', type: 'text' },
      { key: 'department', label: '개설학부', type: 'select', options: departmentOptions },
      { key: 'credit', label: '학점', type: 'text', suffix: '학점' },
      { key: 'semester', label: '이수학기', type: 'select', options: SEMESTER_OPTIONS },
      { key: 'area', label: '영역', type: 'select', options: areaOptions },
    ] as const;

    useImperativeHandle(ref, () => ({ getCourses: () => rows }), [rows]);

    useEffect(() => {
      if (!isEditing) setRows(courses);
    }, [courses, isEditing]);

    if (isEditing !== prevIsEditing) {
      setPrevIsEditing(isEditing);
      if (!isEditing) {
        setSelectedIds(new Set());
        setExpanded(true);
        setOpenCellKey(null);
      }
    }

    const hasEmptyValue = rows.some((row) => row.courseName.trim() === '' || row.credit.trim() === '');

    useEffect(() => {
      onValidityChange?.(!hasEmptyValue);
    }, [hasEmptyValue, onValidityChange]);

    const isCollapsed = !expanded && !isEditing;
    const canToggle = !isEditing && rows.length > MIN_ROWS_TO_COLLAPSE;
    const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;

    useLayoutEffect(() => {
      if (!isCollapsed) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const updateCollapsedHeight = () => {
        const naturalHeight = wrapper.scrollHeight;
        const appliedHeight = wrapper.getBoundingClientRect().height;
        const bodyHeight = document.body.scrollHeight;

        if (bodyHeight > window.innerHeight) {
          restOfPageHeightRef.current = bodyHeight - appliedHeight;
        }
        const restOfPageHeight = restOfPageHeightRef.current ?? Math.max(0, bodyHeight - naturalHeight);

        const availableHeight = window.innerHeight - restOfPageHeight;
        setCollapsedHeight(Math.max(MIN_COLLAPSED_HEIGHT, Math.min(naturalHeight, availableHeight)));
      };

      updateCollapsedHeight();
      window.addEventListener('resize', updateCollapsedHeight);

      return () => window.removeEventListener('resize', updateCollapsedHeight);
    }, [isCollapsed, rows.length]);

    const handleToggleClick = () => {
      setExpanded((prev) => !prev);
    };

    const handleCellChange = (id: string, key: (typeof columns)[number]['key']) => (value: string) => {
      const nextValue = key === 'credit' ? toCreditValue(value) : value;
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: nextValue } : row)));
    };

    const handleDepartmentChange = (id: string) => (value: string) => {
      const department = departments.find(({ name }) => name === value);
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, department: value, departmentId: department?.departmentId ?? null } : row,
        ),
      );
    };

    const handleAreaChange = (id: string) => (value: string) => {
      const division = divisions.find(({ name }) => name === value);
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, area: value, areaId: division?.id ?? null } : row)),
      );
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
      setIsDeleteModalOpen(true);
    };

    const handleAddClick = () => {
      setIsAddModalOpen(true);
    };

    const handleAddCourseSubmit = ({ courseId, courseName, credit, area, semester }: AddCourseValues) => {
      const division = divisions.find(({ name }) => name === area);

      setRows((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          courseId,
          courseName,
          department: '해당없음',
          departmentId: null,
          credit,
          semester,
          area,
          areaId: division?.id ?? null,
        },
      ]);
    };

    const handleDeleteConfirm = () => {
      const remainingRows = rows.filter((row) => !selectedIds.has(row.id));
      setRows(remainingRows);
      setSelectedIds(new Set());
      setIsDeleteModalOpen(false);
      onDeleteRows?.(remainingRows);
    };

    return (
      <section className="flex flex-col gap-18 rounded-lg bg-white px-24 py-20">
        <div className="flex h-32 w-full items-center justify-between">
          <p className="text-body-sb-16 text-gray-600">과목정보</p>
          {isEditing && (
            <div className="flex items-center gap-12">
              <Button label="과목추가" mode="secondary_outline" size="sm" onClick={handleAddClick} />
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
            ref={wrapperRef}
            className={cn('w-full transition-[max-height] duration-300 ease-in-out', isCollapsed && 'overflow-hidden')}
            style={{ maxHeight: isCollapsed ? collapsedHeight : 3000 }}
          >
            <table className="w-full table-fixed border-separate [border-spacing:0_4px]">
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
                        className="mx-auto flex size-20 items-center justify-center"
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
                {rows.map((course) => (
                  <tr key={course.id}>
                    {isEditing && (
                      <td className="px-8 py-4 align-middle">
                        <button
                          type="button"
                          onClick={handleRowSelectClick(course.id)}
                          aria-label={`${course.courseName} 선택`}
                          className="mx-auto flex size-20 items-center justify-center"
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
                            onChange={
                              column.key === 'department'
                                ? handleDepartmentChange(course.id)
                                : column.key === 'area'
                                  ? handleAreaChange(course.id)
                                  : handleCellChange(course.id, column.key)
                            }
                            isOpen={openCellKey === `${course.id}:${column.key}`}
                            onOpenChange={(open) => setOpenCellKey(open ? `${course.id}:${column.key}` : null)}
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
        <ConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          type="delete"
          title={`선택한 과목 ${selectedIds.size}개를 삭제할까요?`}
          description="삭제한 과목은 복구할 수 없어요."
          onConfirm={handleDeleteConfirm}
        />
        <AddCourseModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddCourseSubmit} />
      </section>
    );
  },
);

CourseInfoTable.displayName = 'CourseInfoTable';
