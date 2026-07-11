'use client';

import type { ViewMode } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const VIEW_MODE_QUERY_KEY = 'view';
const DEFAULT_VIEW_MODE: ViewMode = 'card';

const isViewMode = (value: string | null): value is ViewMode => value === 'card' || value === 'roadmap';

export const useViewMode = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramValue = searchParams.get(VIEW_MODE_QUERY_KEY);
  const viewMode = isViewMode(paramValue) ? paramValue : DEFAULT_VIEW_MODE;

  useEffect(() => {
    if (paramValue === null || isViewMode(paramValue)) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set(VIEW_MODE_QUERY_KEY, DEFAULT_VIEW_MODE);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [paramValue, pathname, router, searchParams]);

  const setViewMode = (nextViewMode: ViewMode) => {
    if (nextViewMode === viewMode) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set(VIEW_MODE_QUERY_KEY, nextViewMode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { viewMode, setViewMode };
};
