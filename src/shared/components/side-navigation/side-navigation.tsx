'use client';

import Icon from '@shared/components/icon/icon';
import { NavItem } from '@shared/components/nav-item/nav-item';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';
import { usePathname, useRouter } from 'next/navigation';

export interface SideNavigationAcademicInfoItem {
  label: string;
  value: string;
}

interface SideNavigationProps {
  academicInfo?: SideNavigationAcademicInfoItem[];
}

// TODO: api 연동 후 교체
const FALLBACK_ACADEMIC_INFO: SideNavigationAcademicInfoItem[] = [
  { label: '학교', value: '경희대학교 국제 캠퍼스' },
  { label: '소속학부', value: '소프트웨어 융합학과' },
  { label: '학번', value: '00000000000' },
  { label: '학년', value: '4학년 1학기' },
];

// TODO: 실제 endpoint로 교체
const NAV_ITEMS = [
  { label: '나의 현황', iconName: 'ic_home', href: '/' },
  { label: '학기플래너', iconName: 'ic_planner', href: '/semester-planner' },
] as const;

const isNavItemActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const SideNavigation = ({ academicInfo = FALLBACK_ACADEMIC_INFO }: SideNavigationProps) => {
  const isCollapsed = useSideNavigationStore((state) => state.isCollapsed);
  const toggleSidebar = useSideNavigationStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavItemClick = (href: string) => {
    router.push(href);
  };

  const handleToggleClick = () => {
    toggleSidebar();
  };

  return (
    <aside
      aria-label="사이드 내비게이션"
      className={cn(
        'flex h-full shrink-0 flex-col justify-between overflow-hidden border-r border-gray-100 bg-gray-900 pt-40 pb-24 transition-[width] duration-300 ease-in-out',
        isCollapsed ? 'w-72' : 'w-240',
      )}
    >
      <div className="flex flex-col gap-40">
        <header className="relative flex h-24 items-center px-24">
          <div
            className={cn(
              'flex items-center gap-12 transition-opacity duration-300',
              isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
          >
            <img src="/images/logo.svg" alt="Growing Pots" width={119} height={20} />
          </div>

          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            className="absolute right-24 flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg transition-all duration-300 ease-in-out"
            onClick={handleToggleClick}
          >
            <Icon name={'ic_left_panel'} size={24} className="text-gray-500" />
          </button>
        </header>

        <nav>
          <ul className="flex flex-col gap-12 px-12">
            {NAV_ITEMS.map(({ label, iconName, href }) => (
              <li key={label}>
                <NavItem
                  icon={iconName}
                  label={label}
                  isCollapsed={isCollapsed}
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
            isCollapsed ? 'pointer-events-none grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="flex flex-col gap-8 overflow-hidden">
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-4 rounded bg-gray-800 px-12 py-6"
            >
              <Icon name="ic_home" />
              <span className="text-body-m-14 text-gray-300">졸업사정관리표</span>
            </button>
            <section aria-label="학력 정보">
              <dl className="flex min-w-[216px] flex-col gap-12 rounded-md bg-gray-800 p-16">
                {academicInfo.map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between whitespace-nowrap">
                    <dt className="text-body-r-14 text-gray-300">{label}</dt>
                    <dd className="text-body-m-14 text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <section
          aria-label="프로필"
          className={cn(
            'flex items-center p-12 transition-[gap] duration-300 ease-in-out',
            isCollapsed ? 'justify-center' : 'gap-12',
          )}
        >
          <Icon name="ic_home" />
          {!isCollapsed && (
            <>
              <p className="text-body-m-16 min-w-0 flex-1 truncate text-white">사용자</p>
              <button type="button" aria-label="로그아웃" className="flex shrink-0 cursor-pointer">
                <Icon name="ic_logout" size={24} className="text-gray-500" />
              </button>
            </>
          )}
        </section>
      </footer>
    </aside>
  );
};
