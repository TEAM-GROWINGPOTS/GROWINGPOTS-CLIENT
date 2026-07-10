'use client';

import { IconButton } from '@shared/components';
import { cn } from '@shared/utils/cn';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    lines: ['졸업사정관리표 PDF를 업로드해 주세요', '분석해 드림'],
    image: null,
  },
  {
    lines: ['현황확인'],
    image: null,
  },
  {
    lines: ['카드뷰'],
    image: null,
  },
  {
    lines: ['졸업까지의 학기 계획을', '나만의 로드맵을 통해 완성해 보세요'],
    image: null,
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

  const handlePrevClick = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const handleNextClick = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="flex size-full items-center justify-between overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 px-40 py-120">
      <IconButton icon="ic_chevron_left" aria-label="이전 슬라이드" onClick={handlePrevClick} />

      <div className="flex w-545 shrink-0 flex-col items-center gap-80">
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {SLIDES.map(({ lines }, index) => (
              <div key={index} className="min-w-0 flex-[0_0_100%]">
                <div className="flex flex-col items-center gap-32">
                  <div className="text-title-sb-24 min-h-63 w-full text-center text-gray-900">
                    {lines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className="h-340 w-full overflow-hidden rounded-2xl border-[6px] border-gray-700 bg-gray-100" />
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
              className={cn('rounded-full', index === selectedIndex ? 'h-7 w-95 bg-gray-800' : 'size-7 bg-gray-200')}
            />
          ))}
        </div>
      </div>

      <IconButton icon="ic_chevron_right" aria-label="다음 슬라이드" onClick={handleNextClick} />
    </div>
  );
};
