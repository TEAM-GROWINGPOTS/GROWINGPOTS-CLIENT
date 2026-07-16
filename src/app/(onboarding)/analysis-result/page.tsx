import { AnalysisResultView } from '@features/onboarding';
import { cookies } from 'next/headers';

export default async function AnalysisResultPage() {
  const cookieStore = await cookies();
  const isOnboardingCompleted = cookieStore.get('onboardingCompleted')?.value === 'true';

  return <AnalysisResultView isOnboardingCompleted={isOnboardingCompleted} />;
}
