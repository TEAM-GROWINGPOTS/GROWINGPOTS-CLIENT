'use client';

import { useState } from 'react';

import { PdfUploadStep } from '../pdf-upload-step/pdf-upload-step';
import { StudentInfoStep, type StudentInfoValues } from '../student-info-step/student-info-step';

export const OnboardingFlow = () => {
  const [studentInfo, setStudentInfo] = useState<StudentInfoValues | null>(null);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <section className="shadow-large flex min-w-480 flex-col rounded-xl bg-white p-32">
        {!studentInfo && <StudentInfoStep onSubmit={setStudentInfo} />}
        {studentInfo && <PdfUploadStep />}
      </section>
    </main>
  );
};
