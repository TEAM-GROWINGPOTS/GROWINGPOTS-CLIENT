'use client';

import { IconButton } from '@shared/components';
import { cn } from '@shared/utils/cn';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

const DOT_SIZE = 7;

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  autoplay?: boolean;
  autoplayDelay?: number;
  dotExpandedWidth?: number;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
}

export const Carousel = <T,>({
  items,
  renderItem,
  autoplay = true,
  autoplayDelay = 3000,
  dotExpandedWidth = 95,
  className,
  contentClassName,
  slideClassName,
}: CarouselProps<T>) => {
  const [plugins] = useState(() => (autoplay ? [Autoplay({ delay: autoplayDelay })] : []));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [dotRatios, setDotRatios] = useState<number[]>(() => items.map((_, index) => (index === 0 ? 1 : 0)));

  const handleScroll = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const progress = ((emblaApi.scrollProgress() % 1) + 1) % 1;

    setDotRatios(
      snaps.map((snap) => {
        const distance = Math.abs(progress - snap);
        const wrappedDistance = Math.min(distance, 1 - distance);
        return Math.max(0, 1 - wrappedDistance * snaps.length);
      }),
    );
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('scroll', handleScroll);
    emblaApi.on('reInit', handleScroll);
    return () => {
      emblaApi.off('scroll', handleScroll);
      emblaApi.off('reInit', handleScroll);
    };
  }, [emblaApi, handleScroll]);

  const handlePrevClick = useCallback(() => {
    emblaApi?.scrollPrev();
    emblaApi?.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  const handleNextClick = useCallback(() => {
    emblaApi?.scrollNext();
    emblaApi?.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  return (
    <div className={cn('flex size-full items-center justify-between overflow-hidden', className)}>
      <IconButton icon="ic_chevron_left" aria-label="이전 슬라이드" onClick={handlePrevClick} />

      <div className={cn('flex flex-1 flex-col items-center gap-80 overflow-hidden', contentClassName)}>
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {items.map((item, index) => (
              <div key={index} className={cn('flex min-w-0 flex-[0_0_100%] justify-center', slideClassName)}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-fit items-center justify-center gap-6 rounded-full py-8">
          {items.map((_, index) => (
            <div
              key={index}
              aria-label={`${index + 1}번 슬라이드`}
              className="h-7 rounded-full"
              style={{
                width: DOT_SIZE + (dotExpandedWidth - DOT_SIZE) * dotRatios[index],
                backgroundColor: `color-mix(in oklab, var(--color-gray-800) ${dotRatios[index] * 100}%, var(--color-gray-200))`,
              }}
            />
          ))}
        </div>
      </div>

      <IconButton icon="ic_chevron_right" aria-label="다음 슬라이드" onClick={handleNextClick} />
    </div>
  );
};
