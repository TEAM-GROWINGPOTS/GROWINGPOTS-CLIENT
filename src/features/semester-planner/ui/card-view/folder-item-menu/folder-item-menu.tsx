'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useRef, useState } from 'react';

interface FolderItemMenuProps {
  onRename?: () => void;
  onDelete: () => void;
  iconSize?: number;
  /** true면 호버와 무관하게 버튼을 항상 노출한다. 기본값(false)은 부모의 group-hover에만 반응한다. */
  alwaysVisible?: boolean;
}

const MENU_ITEM_CLASS =
  'flex w-[92px] h-[33px] cursor-pointer items-center justify-between rounded-md border border-white bg-white px-8 py-6 text-left hover:bg-gray-50';

export const FolderItemMenu = ({ onRename, onDelete, iconSize = 20, alwaysVisible = false }: FolderItemMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    // capture 단계에서 감지해야 한다: 로드맵 뷰에서는 이 메뉴가 React Flow의 draggable 노드 안에 있어서,
    // bubble 단계로 등록하면 노드/캔버스의 자체 드래그·팬 핸들러가 먼저 stopPropagation을 호출해
    // document까지 이벤트가 올라오지 못한다(엣지·핸들처럼 드래그 대상이 아닌 요소는 원래도 문제없었다).
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className="nodrag relative flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="폴더 옵션 열기"
        className={cn(
          'cursor-pointer',
          alwaysVisible ? 'visible' : 'invisible group-hover:visible',
          isMenuOpen && 'visible',
        )}
      >
        <Icon name="ic_dot_vertical" size={iconSize} className="mb-0.5 text-gray-600" />
      </button>
      {isMenuOpen && (
        <ul
          role="menu"
          className="z-dropdown absolute top-full right-0 flex w-fit flex-col items-start rounded-lg border border-gray-100 bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]"
        >
          {onRename && (
            <li role="none" className="w-full">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onRename();
                  setIsMenuOpen(false);
                }}
                className={MENU_ITEM_CLASS}
              >
                <span className="text-body-m-14 line-clamp-1 flex-1 text-gray-700">이름 편집</span>
              </button>
            </li>
          )}
          <li role="none" className="w-full">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDelete();
                setIsMenuOpen(false);
              }}
              className={MENU_ITEM_CLASS}
            >
              <span className="text-body-m-14 line-clamp-1 flex-1 text-[#FF3451]">삭제</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
