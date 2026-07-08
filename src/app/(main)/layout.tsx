import { SideNavigation } from '@shared/components/side-navigation/side-navigation';
import { cookies } from 'next/headers';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialIsCollapsed = cookieStore.get('side-navigation-collapsed')?.value === 'true';

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavigation initialIsCollapsed={initialIsCollapsed} />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
