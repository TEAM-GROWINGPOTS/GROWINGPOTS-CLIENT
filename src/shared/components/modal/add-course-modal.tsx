'use client';

import { getCourses } from '@shared/apis/get-courses';
import { QUERY_KEY } from '@shared/apis/query-key';
import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { TextField } from '@shared/components/text-field/text-field';
import { useDebouncedValue } from '@shared/hooks/use-debounced-value';
import { cn } from '@shared/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { Modal } from './modal';

const COURSE_NAME_MATCH_SIZE = 50;

interface SelectOption {
  value: string;
  label: string;
}

const DIRECT_INPUT_CREDIT = 'DIRECT';

export const CREDIT_OPTIONS: SelectOption[] = [
  ...Array.from({ length: 5 }, (_, i) => `${i}`).map((value) => ({ value, label: `${value}학점` })),
  { value: DIRECT_INPUT_CREDIT, label: '직접입력' },
];

const toCreditValue = (value: string) => {
  const [integerPart = '', ...rest] = value.replace(/[^0-9.]/g, '').split('.');
  const wholeNumber = integerPart.slice(0, 2);

  if (rest.length === 0) return wholeNumber;

  const half = rest.join('').replace(/[^5]/g, '').slice(0, 1);
  return `${wholeNumber}.${half}`;
};

export const AREA_OPTIONS: SelectOption[] = [
  '전공기초',
  '전공필수',
  '전공선택',
  '필수교과',
  '배분이수교과',
  '자유이수교과',
  '일반선택',
].map((label) => ({ value: label, label }));

export const SEMESTER_OPTIONS: SelectOption[] = ['1학기', '여름학기', '2학기', '겨울학기'].map((label) => ({
  value: label,
  label,
}));

export interface AddCourseValues {
  courseId: number;
  courseName: string;
  credit: string;
  area: string;
  semester: string;
}

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddCourseValues) => void;
}

export const AddCourseModal = ({ open, onOpenChange, onSubmit }: AddCourseModalProps) => {
  const [courseName, setCourseName] = useState('');
  const [credit, setCredit] = useState('');
  const [customCredit, setCustomCredit] = useState('');
  const [area, setArea] = useState('');
  const [semester, setSemester] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedCourseName = useDebouncedValue(courseName.trim());
  const { data: searchedCourses = [], isFetching: isSearchingCourse } = useQuery({
    queryKey: QUERY_KEY.COURSES.SEARCH({ keyword: debouncedCourseName, size: COURSE_NAME_MATCH_SIZE }),
    queryFn: () => getCourses({ keyword: debouncedCourseName, size: COURSE_NAME_MATCH_SIZE }),
    select: (data) => data.courses,
    enabled: debouncedCourseName !== '',
  });
  const matchedCourse = searchedCourses.find((course) => course.name === courseName.trim());
  const isCourseNameValid = matchedCourse !== undefined;
  const isSearchSettled = debouncedCourseName === courseName.trim() && !isSearchingCourse;
  const showError = touched && courseName.trim() !== '' && isSearchSettled && !isCourseNameValid;
  const isDirectCredit = credit === DIRECT_INPUT_CREDIT;
  const finalCredit = isDirectCredit ? customCredit : credit;
  const canSubmit = isCourseNameValid && finalCredit !== '' && area !== '' && semester !== '';

  const resetForm = () => {
    setCourseName('');
    setCredit('');
    setCustomCredit('');
    setArea('');
    setSemester('');
    setTouched(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleCourseNameChange = (value: string) => {
    setCourseName(value);
    setTouched(false);
  };

  const handleCourseNameBlur = () => {
    setTouched(true);
  };

  const handleCourseNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  const handleCreditChange = (value: string) => {
    setCredit(value);
    if (value !== DIRECT_INPUT_CREDIT) setCustomCredit('');
  };

  const handleCustomCreditChange = (value: string) => {
    setCustomCredit(toCreditValue(value));
  };

  const handleSubmit = () => {
    if (!canSubmit || !matchedCourse) return;
    onSubmit({ courseId: matchedCourse.courseId, courseName: courseName.trim(), credit: finalCredit, area, semester });
    handleClose();
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Content className={cn('flex w-480 flex-col justify-between', isDirectCredit ? 'h-548' : 'h-484')}>
        <div className="flex flex-col gap-32">
          <Modal.Header title="과목 추가" className="text-title-sb-24 flex-1" />
          <div className="flex w-416 flex-col items-start gap-16">
            <TextField
              ref={inputRef}
              value={courseName}
              onChange={handleCourseNameChange}
              onBlur={handleCourseNameBlur}
              onKeyDown={handleCourseNameKeyDown}
              placeholder="과목명을 입력해 주세요"
              errorMessage={showError ? '* 일치하는 과목명이 없습니다. 다시 확인해 주세요.' : undefined}
            />
            <div className="flex w-full flex-col gap-16">
              <Select options={CREDIT_OPTIONS} value={credit} onChange={handleCreditChange} placeholder="학점" />
              {isDirectCredit && (
                <div className="flex h-48 w-full items-center rounded-lg border border-gray-200 bg-white px-16 py-12">
                  <input
                    value={customCredit}
                    onChange={(e) => handleCustomCreditChange(e.target.value)}
                    placeholder="0"
                    inputMode="decimal"
                    style={{ width: `${Math.max(customCredit.length, 1)}ch` }}
                    className="text-body-m-16 min-w-0 shrink-0 text-gray-600 outline-none placeholder:text-gray-300"
                  />
                  <span className="text-body-m-16 text-gray-400">학점</span>
                </div>
              )}
            </div>
            <Select options={AREA_OPTIONS} value={area} onChange={setArea} placeholder="이수 영역" />
            <Select options={SEMESTER_OPTIONS} value={semester} onChange={setSemester} placeholder="수강학기" />
          </div>
        </div>
        <Modal.Footer>
          <Button
            label="추가하기"
            size="lg"
            mode="primary_solid"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full justify-center"
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
