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

/**
 * Default notifications shown to new users.
 * Defined here to avoid circular dependency between useNotifications and useNotificationAlerts.
 */
export const DEFAULT_NOTIFICATIONS: Notification[] = [
    {
        id: 'welcome',
        title: 'Welcome to the VeChain',
        description:
            'Welcome! Here you can manage your wallet, send tokens, and interact with the VeChain blockchain and its applications.',
        timestamp: Date.now(),
        status: 'success' as const,
        isRead: false,
    },
];
