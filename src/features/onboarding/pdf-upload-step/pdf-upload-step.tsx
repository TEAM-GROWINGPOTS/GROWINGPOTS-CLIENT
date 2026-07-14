'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AnalysisLoading } from '../analysis-loading/analysis-loading';
import { useUploadTranscript } from '../hooks/use-upload-transcript';
import { UploadedCard } from './pdf-uploader/uploaded-card/uploaded-card';
import { Uploader } from './pdf-uploader/uploader/uploader';

const SHOW_LOADING_DELAY_MS = 300;
const MIN_ANALYSIS_LOADING_MS = 3000;

export const PdfUploadStep = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { mutate: uploadTranscript } = useUploadTranscript();

  const handleAnalyze = () => {
    if (!file) return;
    setIsUploading(true);

    const startedAt = Date.now();
    const showLoadingTimer = setTimeout(() => setIsAnalyzing(true), SHOW_LOADING_DELAY_MS);

    uploadTranscript(file, {
      onSuccess: async () => {
        clearTimeout(showLoadingTimer);
        const elapsed = Date.now() - startedAt;
        if (elapsed >= SHOW_LOADING_DELAY_MS) {
          await new Promise((resolve) => setTimeout(resolve, Math.max(MIN_ANALYSIS_LOADING_MS - elapsed, 0)));
        }
        router.push('/analysis-result');
      },
      onError: () => {
        clearTimeout(showLoadingTimer);
        setIsUploading(false);
        setIsAnalyzing(false);
      },
    });
  };

  const handleBack = () => {
    router.push('/onboarding?step=info');
  };

  return (
    <>
      <button type="button" onClick={handleBack} aria-label="이전으로" className="mb-24 cursor-pointer self-start">
        <Icon name="ic_chevron_left" size={24} />
      </button>
      <p className="text-title-sb-24 mb-5 text-gray-900">졸업사정관리표를 업로드해주세요</p>
      <p className="text-body-r-16 mb-32 text-gray-600">업로드한 PDF를 분석해 졸업 현황을 확인할 수 있어요.</p>
      <div className="flex flex-col gap-12">
        <Uploader onFileSelect={setFile} />
        {file && <UploadedCard fileName={file.name} fileSizeBytes={file.size} onRemove={() => setFile(null)} />}
      </div>

      <Button
        label="분석하기"
        size="lg"
        disabled={!file || isUploading}
        className="mt-60 w-full"
        onClick={handleAnalyze}
      />

      {isAnalyzing && <AnalysisLoading />}
    </>
  );
};
