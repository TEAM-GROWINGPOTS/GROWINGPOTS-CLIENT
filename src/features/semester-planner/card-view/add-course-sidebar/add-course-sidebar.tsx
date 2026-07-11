'use client';

import { FILTER_TAB_LABELS } from '@features/semester-planner/card-view/course-filter-modal/course-filter-modal';
import { DropDown } from '@features/semester-planner/card-view/drop-down/drop-down';
import { SearchField } from '@features/semester-planner/card-view/search-field/search-field';
import { IconButton } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { ClassCard } from '@shared/components/class-card/class-card';
import Icon from '@shared/components/icon/icon';
import Image from 'next/image';
import { type ReactNode, useRef, useState } from 'react';

export interface Course {
  id: number;
  department: string;
  title: string;
  tags: string[];
  credit: number;
  divisionName: string;
  isEnglish?: boolean;
  isSw?: boolean;
}

interface AddCourseSidebarProps {
  courses?: Course[];
  selectedFilterLabels?: string[];
  onFilterClick?: (label: string) => void;
  onClose: () => void;
  onDirectAdd: () => void;
  renderCourse?: (course: Course) => ReactNode;
}

const SCROLL_STEP = 120;

export const AddCourseSidebar = ({
  courses = [],
  selectedFilterLabels,
  onFilterClick,
  onClose,
  onDirectAdd,
  renderCourse,
}: AddCourseSidebarProps) => {
  const [keyword, setKeyword] = useState('');
  const [internalSelectedFilters, setInternalSelectedFilters] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const filterRowRef = useRef<HTMLDivElement>(null);

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

  const filteredCourses = courses.filter(({ title }) => title.includes(keyword.trim()));

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
    <aside className="flex h-full w-300 flex-col border-l border-gray-100 bg-gray-50 px-20 pt-48">
      <header className="flex items-center justify-between">
        <h2 className="text-title-sb-20 text-gray-900">과목 추가</h2>
        <button type="button" aria-label="과목 추가 닫기" className="cursor-pointer" onClick={onClose}>
          <Icon name="ic_delete" size={20} className="text-gray-600" />
        </button>
      </header>

      <SearchField value={keyword} onChange={setKeyword} placeholder="검색어를 입력해 주세요" className="mt-24" />

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
          <ul className="mt-8 flex [scrollbar-width:none] flex-col gap-12 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {filteredCourses.map((course) => {
              const { id, department, title, tags, isEnglish, isSw } = course;
              return (
                <li key={id}>
                  {renderCourse ? (
                    renderCourse(course)
                  ) : (
                    <ClassCard
                      department={department}
                      title={title}
                      tags={tags}
                      isEnglish={isEnglish}
                      isSw={isSw}
                      className="border border-gray-100"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
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
        )}
      </section>
    </aside>
  );
};
