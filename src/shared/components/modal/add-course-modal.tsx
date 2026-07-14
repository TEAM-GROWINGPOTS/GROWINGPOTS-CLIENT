'use client';

import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { TextField } from '@shared/components/text-field/text-field';
import { type KeyboardEvent, useRef } from 'react';

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

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  onCourseNameChange: (value: string) => void;
  onCourseNameBlur?: () => void;
  courseNameErrorMessage?: string;
  credit: string;
  onCreditChange: (value: string) => void;
  area: string;
  onAreaChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
}

export const AddCourseModal = ({
  open,
  onOpenChange,
  courseName,
  onCourseNameChange,
  onCourseNameBlur,
  courseNameErrorMessage,
  credit,
  onCreditChange,
  area,
  onAreaChange,
  semester,
  onSemesterChange,
  canSubmit,
  onSubmit,
}: AddCourseModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCourseNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex h-484 w-480 flex-col justify-between">
        <div className="flex flex-col gap-32">
          <Modal.Header title="과목 추가" className="text-title-sb-24 flex-1" />
          <div className="flex w-416 flex-col items-start gap-16">
            <TextField
              ref={inputRef}
              value={courseName}
              onChange={onCourseNameChange}
              onBlur={onCourseNameBlur}
              onKeyDown={handleCourseNameKeyDown}
              placeholder="과목명을 입력해 주세요"
              errorMessage={courseNameErrorMessage}
            />
            <Select options={CREDIT_OPTIONS} value={credit} onChange={onCreditChange} placeholder="학점" />
            <Select options={AREA_OPTIONS} value={area} onChange={onAreaChange} placeholder="이수 영역" />
            <Select options={SEMESTER_OPTIONS} value={semester} onChange={onSemesterChange} placeholder="수강학기" />
          </div>
        </div>
        <Modal.Footer>
          <Button
            label="추가하기"
            size="lg"
            mode="primary_solid"
            disabled={!canSubmit}
            onClick={onSubmit}
            className="w-full justify-center"
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
