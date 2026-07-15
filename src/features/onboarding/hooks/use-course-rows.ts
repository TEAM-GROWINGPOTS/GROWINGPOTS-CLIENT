import type { Division } from '@features/onboarding/types/course';
import type { Column } from '@features/onboarding/types/course-info-table';
import type { DepartmentResponse } from '@shared/apis/types/onboarding-options';
import type { AddCourseValues } from '@shared/components/modal/add-course-modal';
import { useEffect, useState } from 'react';

import { CourseInfo } from '../analysis-result/course-info-table/course-info-table';

const toCreditValue = (value: string) => {
  const [integerPart = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.');
  const wholeNumber = integerPart.slice(0, 2);

  if (rest.length === 0) return wholeNumber;

  const half = rest.join('').replace(/[^5]/g, '').slice(0, 1);
  return `${wholeNumber}.${half}`;
};

interface UseCourseRowsParams {
  courses: CourseInfo[];
  isEditing: boolean;
  departments: DepartmentResponse[];
  divisions: Division[];
  onValidityChange?: (isValid: boolean) => void;
  onDeleteRows?: (remainingCourses: CourseInfo[]) => void;
}

export const useCourseRows = ({
  courses,
  isEditing,
  departments,
  divisions,
  onValidityChange,
  onDeleteRows,
}: UseCourseRowsParams) => {
  const [rows, setRows] = useState(courses);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openCellKey, setOpenCellKey] = useState<string | null>(null);
  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
  const [prevCourses, setPrevCourses] = useState(courses);

  const isEditingChanged = isEditing !== prevIsEditing;
  if (isEditingChanged || courses !== prevCourses) {
    setPrevIsEditing(isEditing);
    setPrevCourses(courses);
    if (!isEditing) setRows(courses);
    if (isEditingChanged && !isEditing) {
      setSelectedIds(new Set());
      setOpenCellKey(null);
    }
  }

  const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;
  const hasEmptyValue = rows.some((row) => row.courseName.trim() === '' || row.credit.trim() === '');

  useEffect(() => {
    onValidityChange?.(!hasEmptyValue);
  }, [hasEmptyValue, onValidityChange]);

  const handleCellChange = (id: string, key: Column['key']) => (value: string) => {
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
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, area: value, areaId: division?.id ?? null } : row)));
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
    onDeleteRows?.(remainingRows);
  };

  return {
    rows,
    selectedIds,
    isAllSelected,
    hasEmptyValue,
    openCellKey,
    setOpenCellKey,
    handleCellChange,
    handleDepartmentChange,
    handleAreaChange,
    handleSelectAllClick,
    handleRowSelectClick,
    handleAddCourseSubmit,
    handleDeleteConfirm,
  };
};
