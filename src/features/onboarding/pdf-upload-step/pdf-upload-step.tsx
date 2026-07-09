import { Button } from '@shared/components/button/button';
import { useState } from 'react';

import { UploadedCard, Uploader } from '../pdf-uploader';

export const PdfUploadStep = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <p className="text-title-sb-24 mb-5 text-gray-900">졸업사정관리표를 업로드해주세요</p>
      <p className="text-body-r-16 mb-32 text-gray-600">업로드한 PDF를 분석해 졸업 현황을 확인할 수 있어요.</p>
      <div className="flex flex-col gap-12">
        <Uploader onFileSelect={setFile} />
        {file && <UploadedCard fileName={file.name} fileSizeBytes={file.size} onRemove={() => setFile(null)} />}
      </div>

      <Button label="분석하기" size="lg" disabled={!file} className="mt-60 w-full" />
    </>
  );
};
