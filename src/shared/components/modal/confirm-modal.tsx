'use client';

import { Button } from '@shared/components/button/button';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

import { Modal } from './modal';

type ConfirmModalTypes = 'delete' | 'saveChanges' | 'notice' | 'logout';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfirmModalTypes;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
}

const CONFIRM_MODAL_DEFAULTS: Record<ConfirmModalTypes, { iconName?: string; confirmLabel: string }> = {
  delete: {
    iconName: 'ic_trash',
    confirmLabel: '삭제',
  },
  saveChanges: {
    iconName: 'ic_alert_triangle_black',
    confirmLabel: '저장',
  },
  notice: {
    iconName: 'ic_alert_triangle_black',
    confirmLabel: '확인',
  },
  logout: {
    confirmLabel: '확인',
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

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="flex w-440 flex-col items-center">
        {iconName && <Icon name={iconName} size={40} className="mb-16" />}
        <Modal.Title className={cn('text-title-sb-18 text-center', description && 'mb-8')}>{title}</Modal.Title>
        {description && <Modal.Description className="text-center">{description}</Modal.Description>}
        <Modal.Footer className="mt-40 w-full">
          {type !== 'notice' && (
            <Button
              label="취소"
              mode="secondary_solid"
              size="lg"
              className="flex-1 justify-center"
              onClick={() => onOpenChange(false)}
            />
          )}
          <Button
            label={confirmLabel ?? defaultConfirmLabel}
            size="lg"
            className="flex-1 justify-center"
            onClick={onConfirm}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
