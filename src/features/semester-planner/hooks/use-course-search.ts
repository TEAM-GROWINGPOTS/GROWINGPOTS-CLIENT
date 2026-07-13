'use client';

import { getCourses } from '@features/semester-planner/api/get-courses';
import type { CourseSearchItemResponse, CourseSearchParams } from '@features/semester-planner/types/course-search';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

const COURSE_PAGE_SIZE = 20;

const isSearchableKeyword = (keyword: string): boolean => !/[ㄱ-ㅎㅏ-ㅣ]/.test(keyword);

interface UseCourseSearchOptions {
  enabled?: boolean;
}

export const useCourseSearch = (
  params: Omit<CourseSearchParams, 'page' | 'size'>,
  { enabled = true }: UseCourseSearchOptions = {},
) =>
  useInfiniteQuery({
    queryKey: ['courses', params],
    queryFn: ({ pageParam }) => getCourses({ ...params, page: pageParam, size: COURSE_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: ({ page }) => (page.hasNext ? page.page + 1 : undefined),
    select: (data): CourseSearchItemResponse[] => data.pages.flatMap(({ courses }) => courses),
    placeholderData: keepPreviousData,
    enabled: enabled && isSearchableKeyword(params.keyword ?? ''),
  });
