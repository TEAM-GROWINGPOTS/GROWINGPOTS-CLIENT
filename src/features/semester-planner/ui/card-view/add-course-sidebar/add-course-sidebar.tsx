'use client';

import type { CourseSearchItemResponse } from '@features/semester-planner/types/course-search';
import { FILTER_TAB_LABELS } from '@features/semester-planner/ui/card-view/course-filter-modal/course-filter-modal';
import { DropDown } from '@features/semester-planner/ui/card-view/drop-down/drop-down';
import { SearchField } from '@features/semester-planner/ui/card-view/search-field/search-field';
import { getCourseTags } from '@features/semester-planner/utils/map-planner';
import { IconButton } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { ClassCard } from '@shared/components/class-card/class-card';
import Icon from '@shared/components/icon/icon';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';

interface AddCourseSidebarProps {
  courses?: CourseSearchItemResponse[];
  keyword?: string;
  onKeywordChange?: (keyword: string) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  selectedFilterLabels?: string[];
  onFilterClick?: (label: string) => void;
  onClose: () => void;
  onDirectAdd: () => void;
  renderCourse?: (course: CourseSearchItemResponse) => ReactNode;
}

const SCROLL_STEP = 120;
const LOAD_MORE_ROOT_MARGIN = '80px';

export const AddCourseSidebar = ({
  courses = [],
  keyword: keywordProp,
  onKeywordChange,
  isLoading = false,
  onLoadMore,
  selectedFilterLabels,
  onFilterClick,
  onClose,
  onDirectAdd,
  renderCourse,
}: AddCourseSidebarProps) => {
  const [internalKeyword, setInternalKeyword] = useState('');
  const [internalSelectedFilters, setInternalSelectedFilters] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const filterRowRef = useRef<HTMLDivElement>(null);

  const keyword = keywordProp ?? internalKeyword;
  const handleKeywordChange = onKeywordChange ?? setInternalKeyword;
  const selectedFilters = selectedFilterLabels ?? internalSelectedFilters;

  const handleFilterClick = (label: string) => {
    if (onFilterClick) {
      onFilterClick(label);
      return;
    }
    setInternalSelectedFilters((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const filteredCourses =
    keywordProp === undefined ? courses.filter(({ name }) => name.includes(keyword.trim())) : courses;

  const listRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore?.();
      },
      { root: listRef.current, rootMargin: LOAD_MORE_ROOT_MARGIN },
    );
    observer.observe(target);

    return () => observer.disconnect();
  });

  const handleFilterRowScroll = () => {
    const row = filterRowRef.current;
    if (!row) return;
    setCanScrollLeft(row.scrollLeft > 0);
    setCanScrollRight(row.scrollLeft < row.scrollWidth - row.clientWidth - 1);
  };

  const handleScrollLeftClick = () => {
    filterRowRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
  };

  const handleScrollRightClick = () => {
    filterRowRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
  };

  return (
    <aside className="flex h-full w-300 flex-col border-l border-gray-100 bg-gray-50 px-20 pt-48 pb-20">
      <header className="flex items-center justify-between">
        <h2 className="text-title-sb-20 text-gray-900">과목 추가</h2>
        <button type="button" aria-label="과목 추가 닫기" className="cursor-pointer" onClick={onClose}>
          <Icon name="ic_delete" size={20} className="text-gray-600" />
        </button>
      </header>

      <SearchField
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="검색어를 입력해 주세요"
        className="mt-24"
      />

      <div className="relative mt-8">
        <div
          ref={filterRowRef}
          onScroll={handleFilterRowScroll}
          className="flex [scrollbar-width:none] gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {FILTER_TAB_LABELS.map((label) => (
            <DropDown
              key={label}
              label={label}
              status={selectedFilters.includes(label) ? 'selected' : 'default'}
              onClick={() => handleFilterClick(label)}
              className="shrink-0"
            />
          ))}
        </div>
        {canScrollLeft && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 h-full w-40 bg-linear-to-r from-[#F9FAFB] from-60% to-[#F9FAFB]/0" />
            <IconButton
              icon="ic_chevron_left"
              aria-label="필터 왼쪽으로 이동"
              size="small"
              onClick={handleScrollLeftClick}
              className="absolute top-1/2 left-0 -translate-y-1/2"
            />
          </>
        )}
        {canScrollRight && (
          <>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-40 bg-linear-to-l from-[#F9FAFB] from-60% to-[#F9FAFB]/0" />
            <IconButton
              icon="ic_chevron_right"
              aria-label="필터 오른쪽으로 이동"
              size="small"
              onClick={handleScrollRightClick}
              className="absolute top-1/2 right-0 -translate-y-1/2"
            />
          </>
        )}
      </div>

      <section className="mt-24 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-body-m-14 text-gray-700">개설 과목</h3>
          <button
            type="button"
            onClick={onDirectAdd}
            className="text-body-m-14 flex cursor-pointer items-center gap-4 text-gray-700"
          >
            <Icon name="ic_plus" size={16} className="text-gray-600" />
            직접추가
          </button>
        </div>
        {filteredCourses.length > 0 ? (
          <ul
            ref={listRef}
            className="mt-8 flex [scrollbar-width:none] flex-col gap-12 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          >
            {filteredCourses.map((course) => {
              const { courseId, departmentName, name, defaultDivisionName, credit, openedSemester, isEnglish, isSw } =
                course;
              return (
                <li key={courseId}>
                  {renderCourse ? (
                    renderCourse(course)
                  ) : (
                    <ClassCard
                      department={departmentName}
                      title={name}
                      tags={getCourseTags(defaultDivisionName, credit, openedSemester)}
                      isEnglish={isEnglish}
                      isSw={isSw}
                      className="border border-gray-100"
                    />
                  )}
                </li>
              );
            })}
            <li ref={loadMoreRef} aria-hidden className="h-1 shrink-0" />
          </ul>
        ) : (
          !isLoading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-12">
              <Image src="/images/img_noresult.png" alt="" width={80} height={80} />
              <p className="text-body-r-16 text-gray-700">검색결과가 없습니다</p>
              <Button
                size="sm"
                mode="primary_outline"
                label="직접추가"
                icon={<Icon name="ic_plus" size={16} />}
                onClick={onDirectAdd}
              />
            </div>
          )
        )}
      </section>
    </aside>
  );
};
