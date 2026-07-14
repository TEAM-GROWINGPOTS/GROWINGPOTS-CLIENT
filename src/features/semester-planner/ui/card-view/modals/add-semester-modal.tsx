'use client';

import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';
import { Select } from '@shared/components/select/select';
import { useState } from 'react';

const YEAR_OPTIONS = [
  { value: '1', label: '1학년' },
  { value: '2', label: '2학년' },
  { value: '3', label: '3학년' },
  { value: '4', label: '4학년' },
  { value: '5', label: '5학년' },
  { value: '6', label: '6학년' },
  { value: '7', label: '7학년' },
  { value: '8', label: '8학년' },
];

const SEMESTER_OPTIONS = [
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
];

interface AddSemesterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (year: string, semester: string) => void;
}

export const AddSemesterModal = ({ open, onOpenChange, onSubmit }: AddSemesterModalProps) => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleClose = () => {
    onOpenChange(false);
    setYear('');
    setSemester('');
  };

  const handleSubmit = () => {
    onSubmit(year, semester);
    handleClose();
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Content className="flex w-480 flex-col gap-60">
        <div className="flex flex-col gap-32">
          <Modal.Header title="학기 추가" className="text-title-sb-24 flex-1" />
          <div className="flex h-240 w-416 items-start gap-10">
            <Select options={YEAR_OPTIONS} value={year} onChange={setYear} placeholder="학년" className="flex-1" />
            <Select
              options={SEMESTER_OPTIONS}
              value={semester}
              onChange={setSemester}
              placeholder="학기"
              className="flex-1"
            />
          </div>
        </div>
        <Modal.Footer>
          <Button
            label="추가하기"
            size="lg"
            mode="primary_solid"
            disabled={!year || !semester}
            onClick={handleSubmit}
            className="w-full justify-center"
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
