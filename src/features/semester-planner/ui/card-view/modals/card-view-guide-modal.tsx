'use client';

import { Button } from '@shared/components/button/button';
import { Carousel } from '@shared/components/carousel/carousel';
import { Modal } from '@shared/components/modal/modal';
import Image from 'next/image';

const CARD_VIEW_GUIDE_SLIDES = [
  {
    title: '학기를 추가하여\n학기별 계획을 관리할 수 있어요',
    image: '/images/card-view-carousel/card-view-carousel_01.webp',
  },
  {
    title: '하나의 학기에 여러 수강 계획을 만들어\n버전별로 관리할 수 있어요',
    image: '/images/card-view-carousel/card-view-carousel_02.webp',
  },
  {
    title: '학기 폴더에 원하는 과목을 담아\n수강 계획을 완성해 보세요',
    image: '/images/card-view-carousel/card-view-carousel_03.webp',
  },
  {
    title: '상단 토글로 목록과 로드맵을\n자유롭게 전환해 보세요',
    image: '/images/card-view-carousel/card-view-carousel_04.webp',
  },
];

interface CardViewGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmLabel: string;
}

export const CardViewGuideModal = ({ open, onOpenChange, confirmLabel }: CardViewGuideModalProps) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex h-558 w-640 flex-col gap-40">
        <Carousel
          items={CARD_VIEW_GUIDE_SLIDES}
          autoplay={false}
          dotExpandedWidth={28}
          className="rounded-xl bg-gray-50 px-32"
          contentClassName="gap-40"
          renderItem={({ title, image }, index) => (
            <div className="flex w-290 flex-col items-center gap-24">
              <p className="text-title-sb-18 text-center whitespace-pre-line text-gray-900">{title}</p>
              <div className="relative h-181 w-290 overflow-hidden rounded-lg border-4 bg-gray-50">
                <Image src={image} alt="" fill priority={index < 3} className="object-cover" />
              </div>
            </div>
          )}
        />
        <Button
          label={confirmLabel}
          size="lg"
          mode="primary_solid"
          onClick={() => onOpenChange(false)}
          className="w-full justify-center"
        />
      </Modal.Content>
    </Modal>
  );
};
