'use client';

import Icon from '@shared/components/icon/icon';
import { useEffect, useRef, useState } from 'react';

interface FolderItemMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export const FolderItemMenu = ({ onRename, onDelete }: FolderItemMenuProps) => {
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
        <ul
          role="menu"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
          }}
          className="absolute top-full left-0 z-50 flex w-100 flex-col items-start rounded-[8px] border border-gray-100 bg-white p-4 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]"
        >
          <li role="none" className="w-full">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onRename();
                setIsMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center rounded-[6px] border border-white bg-white px-8 py-6 text-left hover:bg-gray-50"
            >
              <span className="text-body-m-14 line-clamp-1 flex-1 text-gray-700">이름 편집</span>
            </button>
          </li>
          <li role="none" className="w-full">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDelete();
                setIsMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center rounded-[6px] border border-white bg-white px-8 py-6 text-left hover:bg-gray-50"
            >
              <span className="text-body-m-14 line-clamp-1 flex-1 text-[#FF3451]">삭제</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
