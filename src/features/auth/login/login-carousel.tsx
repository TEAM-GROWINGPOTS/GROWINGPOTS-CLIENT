'use client';

import { IconButton } from '@shared/components';
import { cn } from '@shared/utils/cn';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

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
  const [plugins] = useState(() => [Autoplay({ delay: 3000 })]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi, handleSelect]);

  const handlePrevClick = useCallback(() => {
    emblaApi?.scrollPrev();
    emblaApi?.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  const handleNextClick = useCallback(() => {
    emblaApi?.scrollNext();
    emblaApi?.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  return (
    <div className="flex size-full items-center justify-between overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 px-40 py-120">
      <IconButton icon="ic_chevron_left" aria-label="이전 슬라이드" onClick={handlePrevClick} />

      <div className="flex flex-1 flex-col items-center gap-80 overflow-hidden">
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {SLIDES.map(({ label, lines, image }, index) => (
              <div key={index} className="flex min-w-0 flex-[0_0_100%] justify-center">
                <div className="flex w-545 flex-col items-center gap-32">
                  <div className="flex flex-col items-center gap-12">
                    <p className="text-body-m-16 text-center text-gray-400">{label}</p>
                    <div className="text-title-sb-24 min-h-63 w-full text-center text-gray-900">
                      {lines.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div className="h-340 w-full overflow-hidden rounded-2xl border-[6px] border-gray-700 bg-gray-100">
                    {image && <img src={image} alt="" className="size-full object-cover" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-322 items-center justify-center gap-6 rounded-full p-8">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              aria-label={`${index + 1}번 슬라이드`}
              className={cn(
                'h-7 rounded-full transition-[width,background-color] duration-300',
                index === selectedIndex ? 'w-95 bg-gray-800' : 'w-7 bg-gray-200',
              )}
            />
          ))}
        </div>
      </div>

      <IconButton icon="ic_chevron_right" aria-label="다음 슬라이드" onClick={handleNextClick} />
    </div>
  );
};
