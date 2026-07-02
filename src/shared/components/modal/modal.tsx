'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import Icon from '../icon/icon';

interface ModalRootProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface ModalTriggerProps {
  children: ReactNode;
}

interface ModalCloseProps {
  children: ReactNode;
}

interface ModalContentProps extends ComponentPropsWithoutRef<typeof Dialog.Content> {
  children: ReactNode;
  container?: HTMLElement | null;
}

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

interface ModalTitleProps {
  children: ReactNode;
  className?: string;
}

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

const ModalRoot = ({ defaultOpen, open, onOpenChange, children }: ModalRootProps) => {
  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
};

const ModalTrigger = ({ children }: ModalTriggerProps) => {
  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
};

const ModalClose = ({ children }: ModalCloseProps) => {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
};

const ModalContent = ({ children, className, container, ...props }: ModalContentProps) => {
  const isContained = Boolean(container);
  const positionClass = isContained ? 'absolute' : 'fixed';

  return (
    <Dialog.Portal container={container ?? undefined}>
      <Dialog.Overlay className={cn(positionClass, 'z-modal bg-black-40 inset-0')} />
      <Dialog.Content
        className={cn(
          positionClass,
          'z-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] bg-white px-32 pt-48 pb-32 outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

const ModalHeader = ({ title, onClose, className }: ModalHeaderProps) => {
  return (
    <div className={cn('mb-40 flex items-center justify-between', className)}>
      <Dialog.Title className="text-gray-900">{title}</Dialog.Title>
      <Dialog.Close
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="flex size-24 cursor-pointer items-center justify-center"
      >
        <Icon name="ic_delete" size={24} />
      </Dialog.Close>
    </div>
  );
};

const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <div className={cn('mt-40 flex gap-8', className)}>{children}</div>;
};

const ModalTitle = ({ children, className }: ModalTitleProps) => {
  return <Dialog.Title className={className}>{children}</Dialog.Title>;
};

const ModalDescription = ({ children, className }: ModalDescriptionProps) => {
  return <Dialog.Description className={className}>{children}</Dialog.Description>;
};

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Close: ModalClose,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
});
