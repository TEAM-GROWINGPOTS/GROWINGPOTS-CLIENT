'use client';

import { Carousel } from '@shared/components';
import Image from 'next/image';

const SLIDES = [
  {
    label: '졸업현황 분석',
    lines: ['졸업사정관리표를 업로드하면', '이수 현황과 졸업요건을 분석해 드려요'],
    image: '/images/img_splash_01.webp',
  },
  {
    label: '현황 확인',
    lines: ['영역별 이수 현황과 부족한 학점을', '한눈에 확인할 수 있어요'],
    image: '/images/img_splash_02.webp',
  },
  {
    label: '학기 플래너',
    lines: ['과목을 학기별로 배치해 보며', '나에게 맞는 졸업 경로를 설계할 수 있어요'],
    image: '/images/img_splash_03.webp',
  },
  {
    label: '학기 로드맵',
    lines: ['졸업까지의 학기 계획을', '나만의 로드맵을 통해 완성해 보세요'],
    image: '/images/img_splash_04.webp',
  },
];

export const LoginCarousel = () => {
  return (
    <Carousel
      items={SLIDES}
      className="rounded-3xl border border-gray-100 bg-gray-50 px-40 py-120"
      renderItem={({ label, lines, image }) => (
        <div className="flex w-545 flex-col items-center gap-32">
          <div className="flex flex-col items-center gap-12">
            <p className="text-body-m-16 text-center text-gray-400">{label}</p>
            <div className="text-title-sb-24 min-h-63 w-full text-center text-gray-900">
              {lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <div className="relative h-340 w-full overflow-hidden rounded-2xl border-[6px] border-gray-700 bg-gray-100">
            {image && <Image src={image} alt="" fill className="object-cover" />}
          </div>
        </div>
      )}
    />
  );
};
