'use client';

import { FolderItemMenu } from '@features/semester-planner/card-view/folder-item-menu/folder-item-menu';
import { FolderList } from '@features/semester-planner/card-view/folder-list/folder-list';
import { Badge, ClassCard } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export type SemesterCardStatus = 'completed' | 'current' | 'planned';

export interface SemesterCourse {
  id: string;
  department: string;
  name: string;
  tags: string[];
  credit: number;
}

export interface SemesterFolder {
  id: string;
  name: string;
}

interface SemesterCardProps {
  yearLevel: number;
  semester: number;
  status: SemesterCardStatus;
  folderName: string;
  courses: SemesterCourse[];
  folders?: SemesterFolder[];
  isDropTarget?: boolean;
  renderCourse?: (course: SemesterCourse) => ReactNode;
  className?: string;
  onDeleteTerm?: () => void;
  onAddFolder?: () => void;
  onRenameFolder?: (folderId?: string) => void;
  onDeleteFolder?: (folderId?: string) => void;
  onSwapFolder?: () => void;
}

const STATUS_LABEL: Record<SemesterCardStatus, string> = {
  completed: '이수완료',
  current: '이수 중',
  planned: '이수예정',
};

const STATUS_ICON: Record<SemesterCardStatus, string | null> = {
  completed: 'ic_check_circle',
  current: 'ic_check_circle_gray',
  planned: null,
};

export const SemesterCard = ({
  yearLevel,
  semester,
  status,
  folderName,
  courses,
  folders,
  isDropTarget = false,
  renderCourse,
  className,
  onDeleteTerm,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onSwapFolder,
}: SemesterCardProps) => {
  const [isFolderListOpen, setIsFolderListOpen] = useState(false);
  const folderListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (folderListRef.current && !folderListRef.current.contains(e.target as Node)) {
        setIsFolderListOpen(false);
      }
    };
    if (isFolderListOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFolderListOpen]);

  const handleSwapClick = () => {
    setIsFolderListOpen((prev) => !prev);
    onSwapFolder?.();
  };

  const totalCredit = courses.reduce((sum, { credit }) => sum + credit, 0);
  const isPlanned = status === 'planned';
  const statusIcon = STATUS_ICON[status];

  return (
    <section className={cn('flex max-h-screen w-258 shrink-0 flex-col self-start rounded-xl bg-gray-800', className)}>
      <header className="flex items-center justify-between px-12 pt-12">
        <div className="flex flex-row gap-8">
          {statusIcon && <Icon name={statusIcon} size={20} />}
          <h2 className="text-body-sb-16 text-white">{`${yearLevel}학년 ${semester}학기`}</h2>
          <Badge size="xsmall" variant="secondary">
            {`${totalCredit}학점 ${STATUS_LABEL[status]}`}
          </Badge>
        </div>
        {isPlanned && (
          <div className="[&_button]:visible [&>div>button>svg]:text-gray-300">
            <FolderItemMenu iconSize={20} onDelete={() => onDeleteTerm?.()} />
          </div>
        )}
      </header>
      <div className="mt-10 flex min-h-0 flex-col rounded-xl bg-white px-8 pb-8">
        <div className="flex items-center px-4 pt-12 pb-2">
          <span className="text-body-sb-14 shrink-0 text-gray-600">{folderName}</span>
          {isPlanned && (
            <div className="my-4 flex flex-1 items-center justify-between text-gray-600">
              <div className="[&_button]:visible">
                <FolderItemMenu iconSize={16} onRename={() => onRenameFolder?.()} onDelete={() => onDeleteFolder?.()} />
              </div>
              <div ref={folderListRef} className="relative flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={handleSwapClick}
                  aria-haspopup="menu"
                  aria-expanded={isFolderListOpen}
                  aria-label="폴더 목록 열기"
                  className="cursor-pointer"
                >
                  <Icon name="ic_switch" size={16} />
                </button>
                {isFolderListOpen && (
                  <div className="absolute top-full right-0 z-10 mt-8">
                    <FolderList
                      folders={folders ?? []}
                      onAddFolder={() => onAddFolder?.()}
                      onRenameFolder={(id) => onRenameFolder?.(id)}
                      onDeleteFolder={(id) => onDeleteFolder?.(id)}
                      className="shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="my-8 border-b border-gray-200" />
        <div className="relative flex min-h-0 flex-col">
          {courses.length > 0 ? (
            <ul className="flex min-h-0 flex-col gap-8 overflow-y-auto">
              {courses.map((course) => {
                const { id, department, name, tags } = course;
                return (
                  <li key={id}>
                    {renderCourse ? (
                      renderCourse(course)
                    ) : (
                      <ClassCard
                        department={department}
                        title={name}
                        tags={tags}
                        className="w-full border border-gray-100"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-100 items-center justify-center rounded-md border border-dashed border-gray-300">
              <span className="text-body-m-16 text-gray-500">과목 없음</span>
            </div>
          )}
          {isDropTarget && (
            <div className="pointer-events-none absolute inset-0 rounded-md border border-lime-600 bg-lime-300/20" />
          )}
        </div>
      </div>
    </section>
  );
};
