// Local type alias to avoid circular dependency with components
// The full type is defined in components/AccountModal/Types/Types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AccountModalContentTypes = any;

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
