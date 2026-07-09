'use client';

import { Tabs } from '@features/semester-planner/card-view/tabs/tabs';
import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';
import { Select } from '@shared/components/select/select';
import { useState } from 'react';

type CourseFilterTabKeyTypes = 'campus' | 'major' | 'area' | 'grade' | 'semester' | 'credit' | 'extra';

export interface CourseFilterValues {
  campus: string;
  college: string;
  department: string;
  areas: string[];
  grades: string[];
  semesters: string[];
  credits: string[];
  extras: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

const FILTER_TABS: { value: CourseFilterTabKeyTypes; label: string }[] = [
  { value: 'campus', label: '캠퍼스' },
  { value: 'major', label: '전공' },
  { value: 'area', label: '이수영역' },
  { value: 'grade', label: '학년' },
  { value: 'semester', label: '개설학기' },
  { value: 'credit', label: '학점' },
  { value: 'extra', label: '기타 필수' },
];

const CAMPUS_OPTIONS: FilterOption[] = [{ value: '국제캠퍼스', label: '국제캠퍼스' }];

interface CollegeGroup {
  college: string;
  departments: { departmentId: number; name: string }[];
}

const COLLEGE_GROUPS: CollegeGroup[] = [];

const COLLEGE_OPTIONS: FilterOption[] = COLLEGE_GROUPS.map(({ college }) => ({ value: college, label: college }));

const AREA_OPTIONS: FilterOption[] = [
  { value: '전공필수', label: '전공필수' },
  { value: '전공기초', label: '전공기초' },
  { value: '전공선택', label: '전공선택' },
  { value: '필수교과', label: '필수교과' },
  { value: '배분이수교과', label: '배분이수교과' },
  { value: '자유이수교과', label: '자유이수교과' },
  { value: '교직', label: '교직' },
  { value: '교직전선', label: '교직전선' },
  { value: '타전공인정과목', label: '타전공인정과목' },
];

const GRADE_OPTIONS: FilterOption[] = [
  { value: '1학년', label: '1학년' },
  { value: '2학년', label: '2학년' },
  { value: '3학년', label: '3학년' },
  { value: '4학년', label: '4학년' },
  { value: '5학년', label: '5학년' },
];

const SEMESTER_OPTIONS: FilterOption[] = [
  { value: '전체학기', label: '전체학기' },
  { value: '1학기', label: '1학기' },
  { value: '2학기', label: '2학기' },
];

const CREDIT_OPTIONS: FilterOption[] = [
  { value: '0학점', label: '0학점' },
  { value: '1학점', label: '1학점' },
  { value: '2학점', label: '2학점' },
  { value: '3학점', label: '3학점' },
  { value: '4학점 이상', label: '4학점 이상' },
];

const EXTRA_OPTIONS: FilterOption[] = [
  { value: 'SW인증', label: 'SW인증' },
  { value: '영어강의', label: '영어강의' },
];

const INITIAL_VALUES: CourseFilterValues = {
  campus: '',
  college: '',
  department: '',
  areas: [],
  grades: [],
  semesters: [],
  credits: [],
  extras: [],
};

interface CourseFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (values: CourseFilterValues) => void;
}

export const CourseFilterModal = ({ open, onOpenChange, onApply }: CourseFilterModalProps) => {
  const [activeTab, setActiveTab] = useState<CourseFilterTabKeyTypes>('campus');
  const [values, setValues] = useState<CourseFilterValues>(INITIAL_VALUES);

  const handleTabChange = (next: string) => setActiveTab(next as CourseFilterTabKeyTypes);

  const setFieldValue =
    <K extends keyof CourseFilterValues>(key: K) =>
    (next: CourseFilterValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: next }));

  const departmentOptions: FilterOption[] =
    COLLEGE_GROUPS.find(({ college }) => college === values.college)?.departments.map(({ departmentId, name }) => ({
      value: String(departmentId),
      label: name,
    })) ?? [];

  const handleCollegeChange = (next: string) => {
    setValues((prev) => ({ ...prev, college: next, department: '' }));
  };

  const handleApplyClick = () => {
    onApply(values);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setValues(INITIAL_VALUES);
      setActiveTab('campus');
    }
    onOpenChange(next);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Content className="flex h-420 w-480 flex-col">
        <Modal.Header title="과목 필터" className="text-title-sb-24 text-gray-900" />
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
                options={COLLEGE_OPTIONS}
                value={values.college}
                onChange={handleCollegeChange}
                placeholder="단과대학"
              />
              <Select
                options={departmentOptions}
                value={values.department}
                onChange={setFieldValue('department')}
                placeholder="소속학과부"
                disabled={values.college === ''}
              />
            </>
          )}
          {activeTab === 'area' && (
            <Select
              multiple
              options={AREA_OPTIONS}
              value={values.areas}
              onChange={setFieldValue('areas')}
              placeholder="이수영역"
            />
          )}
          {activeTab === 'grade' && (
            <Select
              multiple
              options={GRADE_OPTIONS}
              value={values.grades}
              onChange={setFieldValue('grades')}
              placeholder="학년"
            />
          )}
          {activeTab === 'semester' && (
            <Select
              multiple
              options={SEMESTER_OPTIONS}
              value={values.semesters}
              onChange={setFieldValue('semesters')}
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
              options={EXTRA_OPTIONS}
              value={values.extras}
              onChange={setFieldValue('extras')}
              placeholder="기타 필수"
            />
          )}
        </section>
        <Modal.Footer className="mt-auto">
          <Button
            label="적용하기"
            mode="primary_solid"
            size="lg"
            onClick={handleApplyClick}
            className="w-full justify-center"
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
