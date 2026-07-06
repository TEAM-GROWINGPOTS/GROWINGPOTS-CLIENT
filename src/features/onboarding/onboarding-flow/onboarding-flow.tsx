'use client';

import { useState } from 'react';

import { PdfUploadStep } from '../pdf-upload-step/pdf-upload-step';
import { StudentInfoStep } from '../student-info-step/student-info-step';

type OnboardingStep = 'student-info' | 'pdf-upload';

export const OnboardingFlow = () => {
  const [step, setStep] = useState<OnboardingStep>('student-info');

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <section className="shadow-large flex min-w-480 flex-col rounded-xl bg-white p-32">
        {step === 'student-info' && <StudentInfoStep onSubmit={() => setStep('pdf-upload')} />}
        {step === 'pdf-upload' && <PdfUploadStep />}
      </section>
    </main>
  );
};
