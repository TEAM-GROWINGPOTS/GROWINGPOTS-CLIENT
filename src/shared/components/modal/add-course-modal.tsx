'use client';

import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { cn } from '@shared/utils/cn';
import { useRef, useState } from 'react';

import { Modal } from './modal';

interface SelectOption {
  value: string;
  label: string;
}

export const CREDIT_OPTIONS: SelectOption[] = Array.from({ length: 6 }, (_, i) => `${i + 1}`).map((value) => ({
  value,
  label: `${value}학점`,
}));

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
  courseName: string;
  credit: string;
  area: string;
  semester: string;
}

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseNameOptions: string[];
  onSubmit: (values: AddCourseValues) => void;
}

export const AddCourseModal = ({ open, onOpenChange, courseNameOptions, onSubmit }: AddCourseModalProps) => {
  const [courseName, setCourseName] = useState('');
  const [credit, setCredit] = useState('');
  const [area, setArea] = useState('');
  const [semester, setSemester] = useState('');
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCourseNameValid = courseNameOptions.includes(courseName.trim());
  const canSubmit = isCourseNameValid && credit !== '' && area !== '' && semester !== '';

  const resetForm = () => {
    setCourseName('');
    setCredit('');
    setArea('');
    setSemester('');
    setShowError(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
    setShowError(false);
  };

  const handleCourseNameBlur = () => {
    setShowError(courseName.trim() !== '' && !isCourseNameValid);
  };

  const handleCourseNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ courseName: courseName.trim(), credit, area, semester });
    handleClose();
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Content className="flex h-484 w-480 flex-col gap-60">
        <div className="flex flex-col gap-32">
          <Modal.Header title="과목 추가" className="text-title-sb-24 flex-1" />
          <div className="flex w-416 flex-col items-start gap-16">
            <div className="flex w-full flex-col gap-6">
              <input
                ref={inputRef}
                value={courseName}
                onChange={handleCourseNameChange}
                onBlur={handleCourseNameBlur}
                onKeyDown={handleCourseNameKeyDown}
                placeholder="과목명을 입력해 주세요"
                aria-invalid={showError}
                className={cn(
                  'text-body-r-16 h-48 w-full rounded-lg border bg-white px-16 py-12 text-gray-800 outline-none placeholder:text-gray-300',
                  showError ? 'border-red-20' : 'border-gray-200 focus:border-gray-600',
                )}
              />
              {showError && (
                <p className="text-body-r-16 text-red-20">* 일치하는 과목명이 없습니다. 다시 확인해 주세요.</p>
              )}
            </div>
            <Select options={CREDIT_OPTIONS} value={credit} onChange={setCredit} placeholder="학점" />
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
