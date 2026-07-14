'use client';

import Icon from '@shared/components/icon/icon';
import { NavItem } from '@shared/components/nav-item/nav-item';
import { useStudentProfile } from '@shared/hooks/use-student-profile';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface SideNavigationAcademicInfoItem {
  label: string;
  value: string;
}

interface SideNavigationProps {
  academicInfo?: SideNavigationAcademicInfoItem[];
  initialIsCollapsed?: boolean;
}

const FALLBACK_ACADEMIC_INFO: SideNavigationAcademicInfoItem[] = [
  { label: '학교', value: '' },
  { label: '소속학부', value: '' },
  { label: '학번', value: '' },
  { label: '학년', value: '' },
];

const NAV_ITEMS = [
  { label: '나의 현황', iconName: 'ic_home', href: '/graduation-dashboard' },
  { label: '학기플래너', iconName: 'ic_planner', href: '/semester-planner' },
] as const;

const GRADE_ICON_BY_YEAR: Record<number, string> = {
  1: '/images/grade_1st.png',
  2: '/images/grade_2nd.png',
  3: '/images/grade_3rd.png',
  4: '/images/grade_4th.png',
  5: '/images/grade_5th.png',
};

const isNavItemActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const SideNavigation = ({ academicInfo, initialIsCollapsed = false }: SideNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: studentProfile } = useStudentProfile();

  const isCollapsed = useSideNavigationStore((state) => state.isCollapsed);
  const isInitialized = useSideNavigationStore((state) => state.isInitialized);
  const isSidebarCollapsed = isInitialized ? isCollapsed : initialIsCollapsed;

  const resolvedAcademicInfo =
    academicInfo ??
    (studentProfile
      ? [
          { label: '학교', value: studentProfile.schoolName },
          { label: '소속학부', value: studentProfile.departmentName },
          { label: '학번', value: studentProfile.studentNo },
          { label: '학년', value: `${studentProfile.gradeLevel}학년 ${studentProfile.semester}학기` },
        ]
      : FALLBACK_ACADEMIC_INFO);

  const gradeIconSrc = GRADE_ICON_BY_YEAR[studentProfile?.gradeLevel ?? 1] ?? GRADE_ICON_BY_YEAR[1];

  const initializeCollapsed = useSideNavigationStore((state) => state.initializeCollapsed);
  const toggleSidebar = useSideNavigationStore((state) => state.toggleSidebar);

  useEffect(() => {
    initializeCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed, initializeCollapsed]);

  const handleNavItemClick = (href: string) => {
    router.push(href);
  };

  const handleToggleClick = () => {
    toggleSidebar();
  };

  const handleReuploadClick = () => {
    router.push('/onboarding?step=pdf');
  };

  return (
    <aside
      aria-label="사이드 내비게이션"
      className={cn(
        'flex h-full shrink-0 flex-col justify-between overflow-hidden border-r border-gray-100 bg-gray-900 pt-40 pb-24 transition-[width] duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-72' : 'w-240',
      )}
    >
      <div className="flex flex-col gap-40">
        <header className="relative flex h-24 items-center px-24">
          <div
            className={cn(
              'flex items-center gap-12 transition-opacity duration-300',
              isSidebarCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
          >
            <img src="/images/logo.svg" alt="Growing Pots" width={119} height={20} />
          </div>

          <button
            type="button"
            aria-expanded={!isSidebarCollapsed}
            aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            className="absolute right-24 flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg transition-all duration-300 ease-in-out"
            onClick={handleToggleClick}
          >
            <Icon name={'ic_left_panel'} size={20} className="text-gray-500" />
          </button>
        </header>

        <nav>
          <ul className="flex flex-col gap-12 px-12">
            {NAV_ITEMS.map(({ label, iconName, href }) => (
              <li key={label}>
                <NavItem
                  icon={iconName}
                  label={label}
                  isCollapsed={isSidebarCollapsed}
                  status={isNavItemActive(pathname, href) ? 'selected' : 'default'}
                  onClick={() => handleNavItemClick(href)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <footer className="flex flex-col gap-12 px-12">
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
            isSidebarCollapsed ? 'pointer-events-none grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="flex flex-col gap-8 overflow-hidden">
            <button
              type="button"
              onClick={handleReuploadClick}
              className="flex cursor-pointer items-center justify-center gap-4 rounded bg-gray-800 px-12 py-6"
            >
              <span className="text-body-m-14 text-gray-300">졸업사정관리표</span>
            </button>
            <section aria-label="학력 정보">
              <dl className="flex min-w-[216px] cursor-default flex-col gap-12 rounded-lg bg-gray-800 p-16">
                {resolvedAcademicInfo.map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between whitespace-nowrap">
                    <dt className="text-body-r-14 text-gray-300">{label}</dt>
                    <dd className="text-body-m-14 text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <section aria-label="프로필" className="flex items-center justify-start p-12">
          <Image src={gradeIconSrc} alt="" width={20} height={20} className="shrink-0" />
          <div
            className={cn(
              'grid min-w-0 flex-1 transition-[grid-template-columns,opacity,transform,margin] duration-200 ease-in-out',
              isSidebarCollapsed
                ? 'pointer-events-none ml-0 -translate-x-1 grid-cols-[0fr] opacity-0'
                : 'ml-4 translate-x-0 grid-cols-[1fr] opacity-100',
            )}
          >
            <div className="flex min-w-0 items-center gap-4 overflow-hidden whitespace-nowrap">
              <p className="text-body-m-16 min-w-0 flex-1 cursor-default overflow-hidden text-white">
                {studentProfile?.name ?? ''}
              </p>
              <button onClick={() => {}} type="button" aria-label="로그아웃" className="flex shrink-0 cursor-pointer">
                <Icon name="ic_logout" size={24} className="text-gray-500" />
              </button>
            </div>
          </div>
        </section>
      </footer>
    </aside>
  );
};
