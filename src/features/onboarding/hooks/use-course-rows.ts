import type { Division } from '@features/onboarding/types/course';
import type { Column } from '@features/onboarding/types/course-info-table';
import { isCourseRowInvalid } from '@features/onboarding/utils/is-course-row-invalid';
import type { DepartmentResponse } from '@shared/apis/types/onboarding-options';
import type { AddCourseValues } from '@shared/components/modal/add-course-modal';
import { parseTakenSemesterValue } from '@shared/utils/taken-semester-format';
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
  const hasInvalidRow = rows.some(isCourseRowInvalid);

  useEffect(() => {
    onValidityChange?.(!hasInvalidRow);
  }, [hasInvalidRow, onValidityChange]);

  const handleCellChange = (id: string, key: Column['key']) => (value: string) => {
    const nextValue = key === 'credit' ? toCreditValue(value) : value;
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: nextValue } : row)));
  };

  const handleDepartmentChange = (id: string) => (value: string) => {
    const department = departments.find(({ departmentId }) => `${departmentId}` === value);
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, department: department?.name ?? '해당없음', departmentId: department?.departmentId ?? null }
          : row,
      ),
    );
  };

  const handleAreaChange = (id: string) => (value: string) => {
    const division = divisions.find(({ id: divisionId }) => `${divisionId}` === value);
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, area: division?.name ?? '해당없음', areaId: division?.id ?? null } : row,
      ),
    );
  };

  const handleSemesterChange = (id: string) => (value: string) => {
    const parsed = parseTakenSemesterValue(value);
    if (!parsed) return;

    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, takenYear: parsed.takenYear, semester: parsed.semester } : row)),
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

  const handleAddCourseSubmit = ({ courseId, courseName, credit, area, takenYear, semester }: AddCourseValues) => {
    const division = divisions.find(({ name }) => name === area);

    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        courseId,
        courseName,
        department: '해당없음',
        departmentId: null,
        credit,
        takenYear,
        semester,
        area,
        areaId: division?.id ?? null,
      },
      ...prev,
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
    hasInvalidRow,
    openCellKey,
    setOpenCellKey,
    handleCellChange,
    handleDepartmentChange,
    handleAreaChange,
    handleSemesterChange,
    handleSelectAllClick,
    handleRowSelectClick,
    handleAddCourseSubmit,
    handleDeleteConfirm,
  };
};
