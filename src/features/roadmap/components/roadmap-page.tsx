'use client';

import { useState } from 'react';

import { RoadmapView } from './roadmap-view';

export const RoadmapPage = () => {
  const [view, setView] = useState<'card' | 'roadmap'>('roadmap');

  if (view === 'card') {
    return (
      <div className="flex h-screen flex-col">
        {/* 카드뷰 헤더 자리 — 카드뷰 구현 시 교체 */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
          <button
            onClick={() => setView('roadmap')}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            로드맵 보기
          </button>
        </div>
        <main className="flex flex-1 items-center justify-center text-gray-400">카드뷰 (준비중)</main>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <RoadmapView view={view} onViewChange={setView} />
    </div>
  );
};
