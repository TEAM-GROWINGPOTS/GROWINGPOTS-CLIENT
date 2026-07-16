'use client';

import { getSemesterLabel } from '@features/semester-planner/constants';
import type { SemesterCardStatus, SemesterCourse, SemesterFolder } from '@features/semester-planner/types/planner';
import { FolderItemMenu } from '@features/semester-planner/ui/card-view/folder-item-menu/folder-item-menu';
import { FolderList } from '@features/semester-planner/ui/card-view/folder-list/folder-list';
import { FolderRenameModal } from '@features/semester-planner/ui/card-view/folder-rename-modal/folder-rename-modal';
import { getCourseNote } from '@features/semester-planner/utils/map-planner';
import { Badge, ClassCard } from '@shared/components';
import Icon from '@shared/components/icon/icon';
import { ConfirmModal } from '@shared/components/modal/confirm-modal';
import { cn } from '@shared/utils/cn';
import { type ReactNode, type Ref, useEffect, useRef, useState } from 'react';

interface SemesterCardProps {
  ref?: Ref<HTMLElement>;
  yearLevel: number;
  semester: number;
  semesterLabel?: string;
  status: SemesterCardStatus;
  folderName: string;
  totalCredit: number;
  courses: SemesterCourse[];
  folders?: SemesterFolder[];
  selectedFolderId?: string;
  isDropTarget?: boolean;
  renderCourse?: (course: SemesterCourse) => ReactNode;
  admissionYear?: number;
  className?: string;
  scrollToCourse?: { courseId: string; key: number };
  onDeleteTerm?: () => void;
  onAddFolder?: () => void;
  onSelectFolder?: (folderId: string) => void;
  onRenameFolder?: (folderId: string, name: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}

interface FolderTarget {
  folderId: string;
  folderName: string;
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
  ref,
  yearLevel,
  semester,
  semesterLabel,
  status,
  folderName,
  totalCredit,
  courses,
  folders,
  selectedFolderId,
  isDropTarget = false,
  renderCourse,
  admissionYear,
  className,
  scrollToCourse,
  onDeleteTerm,
  onAddFolder,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
}: SemesterCardProps) => {
  const [isFolderListOpen, setIsFolderListOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FolderTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FolderTarget | null>(null);
  const [isTermDeleteOpen, setIsTermDeleteOpen] = useState(false);
  const folderListRef = useRef<HTMLDivElement>(null);
  const courseListRef = useRef<HTMLUListElement>(null);

  const scrollTargetCourseId = scrollToCourse?.courseId;
  const scrollTargetKey = scrollToCourse?.key;

  useEffect(() => {
    if (!scrollTargetCourseId || scrollTargetKey === undefined) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const list = courseListRef.current;
        const item = list?.querySelector(`[data-course-id="${scrollTargetCourseId}"]`) as HTMLElement | null;
        if (!list || !item) return;

        const scrollTop = list.scrollTop + item.getBoundingClientRect().top - list.getBoundingClientRect().top;
        list.scrollTo({ top: scrollTop, behavior: 'smooth' });
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [scrollTargetCourseId, scrollTargetKey]);

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
  };

  const handleSelectFolder = (folderId: string) => {
    onSelectFolder?.(folderId);
    setIsFolderListOpen(false);
  };

  const handleRenameFolderClick = (folderId: string) => {
    const folder = folders?.find(({ id }) => id === folderId);
    if (!folder) return;
    setRenameTarget({ folderId, folderName: folder.name });
  };

  const handleRenameFolderSave = (name: string) => {
    if (!renameTarget) return;
    onRenameFolder?.(renameTarget.folderId, name);
    setRenameTarget(null);
  };

  const handleDeleteFolderClick = (folderId: string) => {
    const folder = folders?.find(({ id }) => id === folderId);
    if (!folder) return;
    setDeleteTarget({ folderId, folderName: folder.name });
  };

  const handleConfirmDeleteFolder = () => {
    if (!deleteTarget) return;
    onDeleteFolder?.(deleteTarget.folderId);
    setDeleteTarget(null);
  };

  const handleConfirmDeleteTerm = () => {
    onDeleteTerm?.();
    setIsTermDeleteOpen(false);
  };

  const isPlanned = status === 'planned';
  const statusIcon = STATUS_ICON[status];
  const termLabel = `${yearLevel}학년 ${semesterLabel ?? getSemesterLabel(semester)}`;
  const isLastFolder = (folders?.length ?? 0) <= 1;

  return (
    <section
      ref={ref}
      className={cn('flex max-h-screen w-258 shrink-0 flex-col self-start rounded-xl bg-gray-800', className)}
    >
      <header className="flex items-center justify-between px-12 pt-12">
        <div className="flex flex-row gap-8">
          {statusIcon && <Icon name={statusIcon} size={20} />}
          <h2 className="text-body-sb-16 text-white">{termLabel}</h2>
          <Badge size="xsmall" variant="secondary">
            {`${totalCredit}학점 ${STATUS_LABEL[status]}`}
          </Badge>
        </div>
        {isPlanned && (
          <div className="[&_button]:visible [&>div>button>svg]:text-gray-300">
            <FolderItemMenu iconSize={20} onDelete={() => setIsTermDeleteOpen(true)} />
          </div>
        )}
      </header>
      <div className="mt-10 flex min-h-0 flex-col rounded-xl bg-white px-8 pb-8">
        <div className="flex items-center px-4 pt-12 pb-2">
          <span className="text-body-sb-14 shrink-0 text-gray-600">{folderName}</span>
          {isPlanned && (
            <div className="my-4 flex flex-1 items-center justify-end text-gray-600">
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
                      selectedFolderId={selectedFolderId}
                      onSelectFolder={handleSelectFolder}
                      onAddFolder={() => onAddFolder?.()}
                      onRenameFolder={handleRenameFolderClick}
                      onDeleteFolder={handleDeleteFolderClick}
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
            <ul ref={courseListRef} className="flex min-h-0 flex-col gap-8 overflow-y-auto scroll-smooth">
              {courses.map((course) => {
                const { id, departmentName, name, tags, isEnglish, isSw } = course;
                return (
                  <li key={id} data-course-id={id}>
                    {renderCourse ? (
                      renderCourse(course)
                    ) : (
                      <ClassCard
                        department={departmentName}
                        title={name}
                        tags={tags}
                        isEnglish={isEnglish}
                        isSw={isSw}
                        note={getCourseNote(course, admissionYear)}
                        className="w-full border border-gray-100"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-100 items-center justify-center rounded-md border border-dashed border-gray-300">
              <span className="text-body-m-14 text-gray-400">과목 없음</span>
            </div>
          )}
          {isDropTarget && (
            <div className="pointer-events-none absolute inset-0 rounded-md border border-lime-600 bg-lime-300/20" />
          )}
        </div>
      </div>
      <FolderRenameModal
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
        initialName={renameTarget?.folderName ?? ''}
        onSave={handleRenameFolderSave}
      />
      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        type="delete"
        title={
          isLastFolder
            ? `정말 '${deleteTarget?.folderName ?? ''}'을 삭제하시겠습니까?`
            : `${termLabel}의 '${deleteTarget?.folderName ?? ''}'을 삭제할까요?`
        }
        description={
          isLastFolder
            ? `'${deleteTarget?.folderName ?? ''}'을 삭제하면 ${termLabel} 내 저장된 과목 정보가 모두 삭제되며 복구할 수 없습니다.`
            : '삭제한 폴더는 복구할 수 없어요.'
        }
        onConfirm={handleConfirmDeleteFolder}
      />
      <ConfirmModal
        open={isTermDeleteOpen}
        onOpenChange={setIsTermDeleteOpen}
        type="delete"
        title={`${termLabel}를 삭제할까요?`}
        description="삭제한 학기는 복구할 수 없어요."
        onConfirm={handleConfirmDeleteTerm}
      />
    </section>
  );
};
