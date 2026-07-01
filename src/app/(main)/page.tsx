'use client';

import { UploadedFileCard } from '@features/onboarding';
import { useState } from 'react';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {file &&
        (({ name, size }) => <UploadedFileCard fileName={name} fileSizeBytes={size} onRemove={() => setFile(null)} />)(
          file,
        )}
    </div>
  );
}
