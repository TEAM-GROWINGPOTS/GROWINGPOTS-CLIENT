'use client';

import { Button } from '@shared/components/button/button';
import { Select } from '@shared/components/select/select';
import { TextField } from '@shared/components/text-field/text-field';
import { cn } from '@shared/utils/cn';
import { type KeyboardEvent, useRef, useState } from 'react';

import { Modal } from './modal';

interface SelectOption {
  value: string;
  label: string;
}

const DIRECT_INPUT_CREDIT = 'DIRECT';

export interface AddCourseValues {
  courseId: number;
  courseName: string;
  credit: string;
  area: string;
  semester: string;
}

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
  const [isDirectCredit, setIsDirectCredit] = useState(false);
  const [customCredit, setCustomCredit] = useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (nextOpen) return;

    setIsDirectCredit(false);
    setCustomCredit('');
  };

  const handleCourseNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      inputRef.current?.blur();
    }
  };

  const handleCreditChange = (value: string) => {
    if (value === DIRECT_INPUT_CREDIT) {
      setIsDirectCredit(true);
      setCustomCredit('');
      onCreditChange('');
      return;
    }

    setIsDirectCredit(false);
    setCustomCredit('');
    onCreditChange(value);
  };

  const handleCustomCreditChange = (value: string) => {
    const nextCredit = toCreditValue(value);
    setCustomCredit(nextCredit);
    onCreditChange(nextCredit);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Content className={cn('flex w-480 flex-col justify-between', isDirectCredit ? 'h-548' : 'h-484')}>
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
            <div className="flex w-full flex-col gap-16">
              <Select
                options={CREDIT_OPTIONS}
                value={isDirectCredit ? DIRECT_INPUT_CREDIT : credit}
                onChange={handleCreditChange}
                placeholder="학점"
              />
              {isDirectCredit && (
                <div className="flex h-48 w-full items-center rounded-lg border border-gray-200 bg-white px-16 py-12">
                  <input
                    value={customCredit}
                    onChange={(event) => handleCustomCreditChange(event.target.value)}
                    placeholder="0"
                    inputMode="decimal"
                    style={{ width: `${Math.max(customCredit.length, 1)}ch` }}
                    className="text-body-m-16 min-w-0 shrink-0 text-gray-600 outline-none placeholder:text-gray-300"
                  />
                  <span className="text-body-m-16 text-gray-400">학점</span>
                </div>
              )}
            </div>
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
