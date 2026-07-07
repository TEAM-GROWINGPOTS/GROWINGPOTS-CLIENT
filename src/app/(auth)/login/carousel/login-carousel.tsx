'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    title: '분석',
    description: '졸업사정관리표를 업로드해 주세요\n이수 현황과 졸업요건을 분석해 드려요',
  },
  {
    title: '현황확인',
    description: '현황확인',
  },
  {
    title: '카드뷰',
    description: '카드뷰',
  },
  {
    title: '노드뷰',
    description: '졸업까지의 학기 계획을\n나만의 로드맵을 통해 완성해 보세요',
  },
];

export const LoginCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="flex flex-1 items-center justify-between self-stretch rounded-[24px] border border-gray-100 bg-gray-50 px-40 py-120">
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="이전 슬라이드"
        className="cursor-pointer p-8 text-gray-400 hover:text-gray-700"
      >
        &#8249;
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-16">
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {SLIDES.map((slide, index) => (
              <div key={index} className="min-w-0 flex-[0_0_100%]">
                <div className="flex flex-col items-center gap-16">
                  <p className="text-body-m-16 text-center whitespace-pre-line text-gray-700">{slide.description}</p>
                  <div className="aspect-video w-full rounded-[12px] border border-gray-300 bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-8">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1}번 슬라이드로 이동`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={
                index === selectedIndex ? 'h-6 w-24 rounded-full bg-gray-700' : 'h-6 w-6 rounded-full bg-gray-300'
              }
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="다음 슬라이드"
        className="cursor-pointer p-8 text-gray-400 hover:text-gray-700"
      >
        &#8250;
      </button>
    </div>
  );
};
