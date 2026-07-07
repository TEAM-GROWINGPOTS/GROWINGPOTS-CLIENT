import { SideNavigation } from '@shared/components/side-navigation/side-navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavigation />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
