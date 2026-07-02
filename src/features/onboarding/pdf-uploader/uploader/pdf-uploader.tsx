'use client';

import { toast } from '@features/onboarding/toast';
import { Button } from '@shared/components/button/button';
import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const isPdf = (file: File) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

const dropzoneVariants = cva(
  'flex h-220 w-full flex-col items-center justify-start rounded-xl border border-dashed border-gray-200 transition-colors pt-32',
  {
    variants: {
      isDragOver: {
        true: 'bg-gray-50',
        false: 'bg-white',
      },
    },
    defaultVariants: {
      isDragOver: false,
    },
  },
);

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
}

export const PdfUploader = ({ onFileSelect }: PdfUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSelect = (file: File) => {
    if (!isPdf(file)) {
      toast.negative('PDF 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.negative('10MB 이하의 파일만 업로드할 수 있어요.');
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    e.target.value = '';
  };

  return (
    <div
      className={cn(dropzoneVariants({ isDragOver }))}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="size-48 bg-gray-50" />
      <p className="text-body-r-16 mt-8 mb-28 text-center text-gray-900">
        파일을 끌어다 놓거나
        <br />
        ‘파일선택’을 눌러 업로드해 주세요.
      </p>
      <Button mode="primary_outline" size="sm" label="파일선택" onClick={() => inputRef.current?.click()} />
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
    </div>
  );
};
