'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { Modal } from '@shared/components/modal/modal';

interface PrerequisiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'REQUIRED' | 'RECOMMENDED';
  courseName: string;
  prerequisiteName: string;
  onConfirm: () => void;
}

const CONTENT: Record<
  'REQUIRED' | 'RECOMMENDED',
  { title: string; description: (p: { courseName: string; prerequisiteName: string }) => string }
> = {
  REQUIRED: {
    title: '선수과목을 먼저 이수해야 신청할 수 있어요',
    description: ({ prerequisiteName, courseName }) =>
      `'${prerequisiteName}'을 먼저 이수한 후 '${courseName}'을 신청해주세요.`,
  },
  RECOMMENDED: {
    title: '선수과목을 먼저 이수하는 것을 권장하고 있어요',
    description: () => '학과부에서 권장하는 이수 순서이니 확인 후 신청해주세요',
  },
};

export const PrerequisiteModal = ({
  open,
  onOpenChange,
  type,
  courseName,
  prerequisiteName,
  onConfirm,
}: PrerequisiteModalProps) => {
  const { title, description } = CONTENT[type];

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex w-400 flex-col gap-32">
        <div className="flex flex-col items-center gap-16 pt-8 text-center">
          <Icon name="ic_alert_triangle" size={48} />
          <div className="flex flex-col gap-8">
            <Modal.Title className="text-title-sb-18 text-gray-800">{title}</Modal.Title>
            <Modal.Description className="text-body-r-14 text-gray-500">
              {description({ courseName, prerequisiteName })}
            </Modal.Description>
          </div>
        </div>
        <Modal.Footer>
          <Button
            label="확인"
            size="lg"
            mode="primary_solid"
            onClick={handleConfirm}
            className="w-full justify-center"
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
