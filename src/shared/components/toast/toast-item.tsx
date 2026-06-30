import { ReactNode } from 'react';

import Icon from '../icon/icon';

export type ToastVariant = 'information' | 'success' | 'notice' | 'negative';

const ICONS: Record<ToastVariant, ReactNode> = {
  information: <Icon name="ic_check_circle" />, // TODO 아이콘 나오면 변경해야됨
  success: <Icon name="ic_check_circle" />,
  notice: <Icon name="ic_alert_triangle" />,
  negative: <Icon name="ic_alert_circle" />,
};

export const ToastItem = ({ message, variant }: { message: string; variant: ToastVariant }) => (
  <div className="flex gap-2.5 rounded-[10px] bg-gray-600 p-4">
    {ICONS[variant]}
    <span className="text-body-m-16 text-white">{message}</span>
  </div>
);
