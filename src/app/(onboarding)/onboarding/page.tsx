import { PdfUploadStep, StudentInfoStep } from '@features/onboarding';
import { notFound } from 'next/navigation';

interface OnboardingPageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { step = 'info' } = await searchParams;

  if (step !== 'info' && step !== 'pdf') {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <section className="shadow-large flex min-w-480 flex-col rounded-xl bg-white p-32">
        {step === 'info' && <StudentInfoStep />}
        {step === 'pdf' && <PdfUploadStep />}
      </section>
    </main>
  );
}
