'use client';

import Icon from '@shared/components/icon/icon';

interface UploadedFileCardProps {
  fileName: string;
  fileSizeBytes: number;
  onRemove: () => void;
}

const KB = 1_000;
const MB = 1_000_000;

const formatFileSize = (bytes: number) => {
  if (bytes < KB) return `${bytes} bytes`;
  if (bytes < MB) return `${Math.round(bytes / KB)} kb`;
  return `${Number((bytes / MB).toFixed(1))} mb`;
};

export const UploadedFileCard = ({ fileName, fileSizeBytes, onRemove }: UploadedFileCardProps) => (
  <div className="flex h-69 items-center rounded-xl border border-gray-100 bg-gray-50 p-12">
    <div className="size-40 bg-amber-300" /> {/* TODO 아이콘이 들어올 것 만 같음. */}
    <div className="flex min-w-0 flex-1 flex-col pr-8 pl-12">
      <span title={fileName} className="text-body-m-16 truncate text-gray-900">
        {fileName}
      </span>
      <span className="text-body-r-14 text-gray-600">{formatFileSize(fileSizeBytes)}</span>
    </div>
    <button
      type="button"
      onClick={onRemove}
      aria-label="파일 삭제"
      className="shrink-0 cursor-pointer self-start text-gray-400"
    >
      <Icon name="ic_delete" size={20} />
    </button>
  </div>
);
