import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import type { ReactNode } from 'react';

import { Modal } from './modal';

type ConfirmModalTypes = 'delete' | 'saveChanges';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfirmModalTypes;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
}

const CONFIRM_MODAL_DEFAULTS: Record<ConfirmModalTypes, { iconName: string; confirmLabel: string }> = {
  delete: {
    iconName: 'ic_trash',
    confirmLabel: '삭제',
  },
  saveChanges: {
    iconName: 'ic_alert_triangle_black',
    confirmLabel: '저장',
  },
};

export const ConfirmModal = ({
  open,
  onOpenChange,
  type,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmModalProps) => {
  const { iconName, confirmLabel: defaultConfirmLabel } = CONFIRM_MODAL_DEFAULTS[type];

  const handleConfirmClick = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="w-440">
        <div className="flex flex-col items-center">
          <Icon name={iconName} size={40} className="mb-16" />
          <Modal.Title className="text-title-sb-18 mb-8 text-center">{title}</Modal.Title>
          {description && <Modal.Description>{description}</Modal.Description>}
          <Modal.Footer className="mt-40 w-full">
            <Button
              label="취소"
              mode="secondary_solid"
              size="lg"
              className="flex-1 justify-center"
              onClick={() => onOpenChange(false)}
            />
            <Button
              label={confirmLabel ?? defaultConfirmLabel}
              size="lg"
              className="flex-1 justify-center"
              onClick={handleConfirmClick}
            />
          </Modal.Footer>
        </div>
      </Modal.Content>
    </Modal>
  );
};
