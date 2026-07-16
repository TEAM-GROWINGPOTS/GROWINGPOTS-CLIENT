'use client';

import { Button } from '@shared/components/button/button';
import { Carousel } from '@shared/components/carousel/carousel';
import { Modal } from '@shared/components/modal/modal';
import Image from 'next/image';

const ROADMAP_GUIDE_SLIDES = [
  {
    title: '같은 학기의 폴더 순서를\n위 아래로 바꿔 흐름을 정리해 보세요',
    image: '/images/node-view-carousel/node-view-carousel_01.webp',
  },
  {
    title: '십자 커서가 표시되면\n기존 연결선을 수정할 수 있어요',
    image: '/images/node-view-carousel/node-view-carousel_02.webp',
  },
  {
    title: '+ 커서가 나타나면\n새로운 연결을 추가할 수 있어요',
    image: '/images/node-view-carousel/node-view-carousel_03.webp',
  },
  {
    title: '새로운 학기와 학기 폴더를\n추가할 수 있어요',
    image: '/images/node-view-carousel/node-view-carousel_04.webp',
  },
];

interface RoadmapGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmLabel: string;
}

export const RoadmapGuideModal = ({ open, onOpenChange, confirmLabel }: RoadmapGuideModalProps) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex h-558 w-640 flex-col gap-40">
        <Carousel
          items={ROADMAP_GUIDE_SLIDES}
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
