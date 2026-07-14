'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { useStudentProfile } from '@shared/hooks/use-student-profile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { UploadedCard } from './pdf-uploader/uploaded-card/uploaded-card';
import { Uploader } from './pdf-uploader/uploader/uploader';

export const PdfUploadStep = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { data: studentProfile } = useStudentProfile();

  const handleAnalyze = () => {
    if (!file) return;
    router.push('/analysis-result');
  };

  const handleBack = () => {
    router.push('/onboarding?step=info');
  };

  return (
    <>
      {!studentProfile && (
        <button type="button" onClick={handleBack} aria-label="이전으로" className="mb-24 cursor-pointer self-start">
          <Icon name="ic_chevron_left" size={24} />
        </button>
      )}
      <p className="text-title-sb-24 mb-5 text-gray-900">졸업사정관리표를 업로드해주세요</p>
      <p className="text-body-r-16 mb-32 text-gray-600">업로드한 PDF를 분석해 졸업 현황을 확인할 수 있어요.</p>
      <div className="flex flex-col gap-12">
        <Uploader onFileSelect={setFile} />
        {file && <UploadedCard fileName={file.name} fileSizeBytes={file.size} onRemove={() => setFile(null)} />}
      </div>

      <Button label="분석하기" size="lg" disabled={!file} className="mt-60 w-full" onClick={handleAnalyze} />
    </>
  );
};
