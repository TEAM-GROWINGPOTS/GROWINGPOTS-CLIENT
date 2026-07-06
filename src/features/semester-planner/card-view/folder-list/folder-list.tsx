'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useRef, useState } from 'react';

const MAX_FOLDERS = 5;

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  onAddFolder: () => void;
  className?: string;
}

export const FolderList = ({ folders, onAddFolder, className }: FolderListProps) => {
  return (
    <div className={cn('flex w-160 flex-col rounded-[6px] border border-gray-200 bg-white p-8', className)}>
      {folders.map(({ id, name }) => (
        <FolderItem key={id} name={name} />
      ))}
      <Button
        label="추가"
        size="sm"
        mode="primary_solid"
        disabled={folders.length >= MAX_FOLDERS}
        onClick={onAddFolder}
        className="mt-4 w-full justify-center"
      />
    </div>
  );
};

interface FolderItemProps {
  name: string;
  onRename?: () => void;
  onDelete?: () => void;
}

const FolderItem = ({ name, onRename, onDelete }: FolderItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="group relative flex w-full items-center justify-between rounded-[6px] border border-white bg-white px-12 py-8 hover:bg-gray-50">
      <span className="text-body-m-14 line-clamp-1 flex-1 text-gray-700">{name}</span>
      <div ref={menuRef} className="relative flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="폴더 옵션 열기"
          className="invisible cursor-pointer group-hover:visible focus-visible:visible focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          <Icon name="ic_dot_horizontal" size={20} className="text-gray-600" />
        </button>
        {isMenuOpen && (
          <ul className="absolute top-full left-0 z-50 flex w-100 flex-col items-start rounded-[8px] border border-gray-100 bg-white p-4 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]">
            <li className="w-full">
              <button
                type="button"
                onClick={() => {
                  onRename?.();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center rounded-[6px] border border-white bg-white px-8 py-6 text-left hover:bg-gray-50"
              >
                <span className="text-body-m-14 line-clamp-1 flex-1 text-gray-700">이름 편집</span>
              </button>
            </li>
            <li className="w-full">
              <button
                type="button"
                onClick={() => {
                  onDelete?.();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center rounded-[6px] border border-white bg-white px-8 py-6 text-left hover:bg-gray-50"
              >
                <span className="text-body-m-14 line-clamp-1 flex-1 text-[#FF3451]">삭제</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
