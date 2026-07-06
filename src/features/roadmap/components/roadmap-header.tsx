'use client';

import { GRADUATION_REQUIREMENTS } from '@features/roadmap/types';
import { cn } from '@shared/utils/cn';
import { useState } from 'react';

const REQUIREMENT_ROWS = [
  { key: '전체', label: '전체' },
  { key: '전공', label: '전공' },
  { key: '전공필수', label: '전공필수' },
  { key: '전공선택', label: '전공선택' },
  { key: '전공기초', label: '전공기초' },
  { key: '필수교과', label: '필수교과' },
  { key: '배분이수교과', label: '배분이수교과' },
  { key: '자유이수교과', label: '자유이수교과' },
  { key: '일반선택', label: '일반선택' },
] as const;

interface RoadmapHeaderProps {
  view: 'card' | 'roadmap';
  onViewChange: (view: 'card' | 'roadmap') => void;
  graduationEarned: Record<string, number>;
}

export const RoadmapHeader = ({ view, onViewChange, graduationEarned }: RoadmapHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalEarned = graduationEarned['전체'] ?? 0;
  const totalRequired = GRADUATION_REQUIREMENTS['전체'];
  const totalShortfall = Math.max(0, totalRequired - totalEarned);
  const isFulfilled = totalShortfall === 0;

  return (
    <div className="flex items-center justify-between bg-white/80 px-6 py-3 backdrop-blur-sm">
      {/* 뷰 토글 */}
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
        <button
          onClick={() => onViewChange('card')}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            view === 'card' ? 'bg-lime-100 text-lime-700' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          카드뷰
        </button>
        <button
          onClick={() => onViewChange('roadmap')}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            view === 'roadmap' ? 'bg-lime-100 text-lime-700' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          로드맵 보기
        </button>
      </div>

      {/* 졸업 요건 드롭다운 */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
        >
          <span className="text-gray-700">졸업 요건 충족 현황</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              isFulfilled ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-600',
            )}
          >
            {isFulfilled ? '충족!' : `${totalShortfall}학점 부족`}
          </span>
          <span className={cn('text-xs text-gray-400 transition-transform', isDropdownOpen ? 'rotate-180' : '')}>
            ▾
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 z-10 mt-1 w-72 rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="divide-y divide-gray-50">
              {REQUIREMENT_ROWS.map(({ key, label }) => {
                const earned = graduationEarned[key] ?? 0;
                const required = GRADUATION_REQUIREMENTS[key];
                const isOver = earned > required;

                return (
                  <div key={key} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={cn('text-sm font-medium', isOver ? 'text-pink-500' : 'text-gray-800')}>
                      {earned}/{required}학점
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
