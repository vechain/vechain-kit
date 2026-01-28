import type { AccountModalContentTypes } from '../../components';

export type NotificationAction = {
    label: string;
    content: AccountModalContentTypes;
};

export type Notification = {
    id: string;
    title: string;
    description: string;
    timestamp: number;
    status: 'success' | 'info' | 'warning' | 'error';
    isRead: boolean;
    action?: NotificationAction;
};
