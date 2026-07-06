'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ModalRootProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface ModalTriggerProps {
  children: ReactNode;
}

interface ModalContentProps extends ComponentPropsWithoutRef<typeof Dialog.Content> {
  children: ReactNode;
}

interface ModalHeaderProps {
  title: string;
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

const ModalContent = ({ children, className, ...props }: ModalContentProps) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="z-modal bg-black-40 fixed inset-0" />
      <Dialog.Content
        aria-describedby={undefined}
        className={cn(
          'z-modal shadow-small fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[0.75rem] bg-white px-32 pt-40 pb-32 outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

const ModalHeader = ({ title, className }: ModalHeaderProps) => {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <Dialog.Title className="text-gray-900">{title}</Dialog.Title>
      <Dialog.Close
        type="button"
        aria-label="모달 닫기"
        className="flex size-24 cursor-pointer items-center justify-center"
      >
        <Icon name="ic_delete" size={24} className="text-gray-500" />
      </Dialog.Close>
    </header>
  );
};

const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <footer className={cn('flex gap-8', className)}>{children}</footer>;
};

const ModalTitle = ({ children, className }: ModalTitleProps) => {
  return <Dialog.Title className={cn('text-gray-900', className)}>{children}</Dialog.Title>;
};

const ModalDescription = ({ children, className }: ModalDescriptionProps) => {
  return <Dialog.Description className={cn('text-body-r-16 text-gray-600', className)}>{children}</Dialog.Description>;
};

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
});
