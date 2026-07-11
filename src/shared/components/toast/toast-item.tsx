import Icon from '@shared/components/icon/icon';
import { ReactNode } from 'react';

export type ToastVariant = 'information' | 'success' | 'notice' | 'negative';

const ICONS: Partial<Record<ToastVariant, ReactNode>> = {
  success: <Icon name="ic_check_circle" />,
  notice: <Icon name="ic_alert_triangle" />,
  negative: <Icon name="ic_alert_circle" />,
};

interface ToastItemProps {
  message: string;
  variant: ToastVariant;
  icon?: ReactNode;
}

export const ToastItem = ({ message, variant, icon }: ToastItemProps) => (
  <div className="flex gap-10 rounded-lg bg-gray-600 p-16">
    {icon ?? ICONS[variant]}
    <span className="text-body-m-16 text-white">{message}</span>
  </div>
);
