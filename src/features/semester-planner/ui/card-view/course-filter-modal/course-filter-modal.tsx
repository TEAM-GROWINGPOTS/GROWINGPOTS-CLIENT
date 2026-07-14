'use client';

import type { DivisionCategory, OtherRequired } from '@features/semester-planner/types/course-search';
import type { OpenedSemester } from '@features/semester-planner/types/planner';
import { parseApiError } from '@shared/apis/parse-api-error';
import { toast } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';
import { Select } from '@shared/components/select/select';
import { Tabs } from '@shared/components/tabs/tabs';
import { useDepartmentOptions } from '@shared/hooks/use-department-options';
import { useEffect, useState } from 'react';

export type CourseFilterTabKeyTypes = 'campus' | 'major' | 'area' | 'grade' | 'semester' | 'credit' | 'extra';

export interface CourseFilterValues {
  campus: string;
  collegeName: string;
  departmentId: string;
  divisionCategory: DivisionCategory[];
  year: string[];
  semester: OpenedSemester[];
  credits: string[];
  otherRequired: OtherRequired[];
}

interface FilterOption {
  value: string;
  label: string;
}

const FILTER_TABS: { value: CourseFilterTabKeyTypes; label: string; fields: (keyof CourseFilterValues)[] }[] = [
  { value: 'campus', label: '캠퍼스', fields: ['campus'] },
  { value: 'major', label: '전공', fields: ['collegeName', 'departmentId'] },
  { value: 'area', label: '이수영역', fields: ['divisionCategory'] },
  { value: 'grade', label: '학년', fields: ['year'] },
  { value: 'semester', label: '개설학기', fields: ['semester'] },
  { value: 'credit', label: '학점', fields: ['credits'] },
  { value: 'extra', label: '기타 필수', fields: ['otherRequired'] },
];

const isTabSelected = (fields: (keyof CourseFilterValues)[], filters: CourseFilterValues): boolean =>
  fields.some((field) => {
    const value = filters[field];
    return Array.isArray(value) ? value.length > 0 : value !== '';
  });

export const getSelectedFilterLabels = (filters: CourseFilterValues | undefined): string[] => {
  if (!filters) return [];

  return FILTER_TABS.filter(({ fields }) => isTabSelected(fields, filters)).map(({ label }) => label);
};

export const getFilterTabByLabel = (label: string): CourseFilterTabKeyTypes | undefined =>
  FILTER_TABS.find((tab) => tab.label === label)?.value;

export const FILTER_TAB_LABELS = FILTER_TABS.map(({ label }) => label);

const CAMPUS_OPTIONS: FilterOption[] = [{ value: '국제캠퍼스', label: '국제캠퍼스' }];

const AREA_OPTIONS: FilterOption[] = [
  { value: 'MAJOR_REQUIRED', label: '전공필수' },
  { value: 'MAJOR_BASIC', label: '전공기초' },
  { value: 'MAJOR_ELECTIVE', label: '전공선택' },
  { value: 'REQUIRED_GE', label: '필수교과' },
  { value: 'DISTRIBUTED_GE', label: '배분이수교과' },
  { value: 'FREE_GE', label: '자유이수교과' },
  { value: 'CROSS_MAJOR', label: '타전공인정과목' },
];

const GRADE_OPTIONS: FilterOption[] = [
  { value: '1', label: '1학년' },
  { value: '2', label: '2학년' },
  { value: '3', label: '3학년' },
  { value: '4', label: '4학년' },
  { value: '5', label: '5학년' },
];

const SEMESTER_OPTIONS: FilterOption[] = [
  { value: 'BOTH', label: '전체학기' },
  { value: 'FIRST', label: '1학기' },
  { value: 'SECOND', label: '2학기' },
];

const CREDIT_OPTIONS: FilterOption[] = [
  { value: '0', label: '0학점' },
  { value: '1', label: '1학점' },
  { value: '2', label: '2학점' },
  { value: '3', label: '3학점' },
  { value: '4', label: '4학점 이상' },
];

const OTHER_REQUIRED_OPTIONS: FilterOption[] = [
  { value: 'SW', label: 'SW인증' },
  { value: 'ENGLISH', label: '영어강의' },
];

export const INITIAL_COURSE_FILTER_VALUES: CourseFilterValues = {
  campus: '',
  collegeName: '',
  departmentId: '',
  divisionCategory: [],
  year: [],
  semester: [],
  credits: [],
  otherRequired: [],
};

interface CourseFilterFormProps {
  initialValues: CourseFilterValues;
  initialTab: CourseFilterTabKeyTypes;
  onApply: (values: CourseFilterValues) => void;
}

const CourseFilterForm = ({ initialValues, initialTab, onApply }: CourseFilterFormProps) => {
  const [activeTab, setActiveTab] = useState<CourseFilterTabKeyTypes>(initialTab);
  const [values, setValues] = useState<CourseFilterValues>(initialValues);
  const { data: departments = [], isError, error } = useDepartmentOptions();

  useEffect(() => {
    if (!isError) return;
    parseApiError(error).then((parsed) => toast.negative(parsed?.message ?? '학과 목록을 불러오지 못했어요.'));
  }, [isError, error]);

  const handleTabChange = (next: string) => setActiveTab(next as CourseFilterTabKeyTypes);

  const setFieldValue =
    <K extends keyof CourseFilterValues>(key: K) =>
    (next: CourseFilterValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: next }));

  const collegeOptions: FilterOption[] = [...new Set(departments.map(({ college }) => college))].map((college) => ({
    value: college,
    label: college,
  }));

  const departmentOptions: FilterOption[] = departments
    .filter(({ college }) => college === values.collegeName)
    .map(({ departmentId, name }) => ({ value: String(departmentId), label: name }));

  const handleCollegeChange = (next: string) => {
    setValues((prev) => ({ ...prev, collegeName: next, departmentId: '' }));
  };

  return (
    <>
      <div className="mt-32 border-b border-gray-200">
        <Tabs items={FILTER_TABS} value={activeTab} onChange={handleTabChange} className="-mb-px" />
      </div>
      <section className="mt-20 flex flex-col gap-10">
        {activeTab === 'campus' && (
          <Select
            options={CAMPUS_OPTIONS}
            value={values.campus}
            onChange={setFieldValue('campus')}
            placeholder="캠퍼스"
          />
        )}
        {activeTab === 'major' && (
          <>
            <Select
              options={collegeOptions}
              value={values.collegeName}
              onChange={handleCollegeChange}
              placeholder="단과대학"
            />
            <Select
              options={departmentOptions}
              value={values.departmentId}
              onChange={setFieldValue('departmentId')}
              placeholder="소속학과부"
              disabled={values.collegeName === ''}
            />
          </>
        )}
        {activeTab === 'area' && (
          <Select
            multiple
            options={AREA_OPTIONS}
            value={values.divisionCategory}
            onChange={(next) => setFieldValue('divisionCategory')(next as DivisionCategory[])}
            placeholder="이수영역"
          />
        )}
        {activeTab === 'grade' && (
          <Select
            multiple
            options={GRADE_OPTIONS}
            value={values.year}
            onChange={setFieldValue('year')}
            placeholder="학년"
          />
        )}
        {activeTab === 'semester' && (
          <Select
            multiple
            options={SEMESTER_OPTIONS}
            value={values.semester}
            onChange={(next) => setFieldValue('semester')(next as OpenedSemester[])}
            placeholder="학기"
          />
        )}
        {activeTab === 'credit' && (
          <Select
            multiple
            options={CREDIT_OPTIONS}
            value={values.credits}
            onChange={setFieldValue('credits')}
            placeholder="학점"
          />
        )}
        {activeTab === 'extra' && (
          <Select
            multiple
            options={OTHER_REQUIRED_OPTIONS}
            value={values.otherRequired}
            onChange={(next) => setFieldValue('otherRequired')(next as OtherRequired[])}
            placeholder="기타 필수"
          />
        )}
      </section>
      <Modal.Footer className="mt-auto">
        <Button
          label="적용하기"
          mode="primary_solid"
          size="lg"
          onClick={() => onApply(values)}
          className="w-full justify-center"
        />
      </Modal.Footer>
    </>
  );
};

interface CourseFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: CourseFilterValues;
  initialTab?: CourseFilterTabKeyTypes;
  onApply: (values: CourseFilterValues) => void;
}

export const CourseFilterModal = ({
  open,
  onOpenChange,
  initialValues,
  initialTab,
  onApply,
}: CourseFilterModalProps) => {
  const handleApply = (values: CourseFilterValues) => {
    onApply(values);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex h-420 w-480 flex-col">
        <Modal.Header title="과목 필터" className="text-title-sb-24 text-gray-900" />
        <CourseFilterForm
          initialValues={initialValues ?? INITIAL_COURSE_FILTER_VALUES}
          initialTab={initialTab ?? 'campus'}
          onApply={handleApply}
        />
      </Modal.Content>
    </Modal>
  );
};
