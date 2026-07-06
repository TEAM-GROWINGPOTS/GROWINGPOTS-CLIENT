import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';

import { ToastItem, ToastVariant } from './toast-item';

const show = (variant: ToastVariant) => (message: string) =>
  sonnerToast.custom(() => <ToastItem variant={variant} message={message} />);

export const toast = {
  information: (message: string, icon?: ReactNode) =>
    sonnerToast.custom(() => <ToastItem variant="information" message={message} icon={icon} />),
  success: show('success'),
  notice: show('notice'),
  negative: show('negative'),
};
