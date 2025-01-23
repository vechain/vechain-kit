import { useCallback, useEffect } from 'react';
import { useWallet } from '@/hooks';

export type Notification = {
    id: string;
    title: string;
    description: string;
    timestamp: number;
    status: 'info' | 'warning' | 'success' | 'error';
    isRead: boolean;
};

const DEFAULT_NOTIFICATIONS = [
    {
        id: 'welcome',
        title: 'Welcome to VeChain',
        description: 'Thank you for joining our ecosystem!',
        timestamp: Date.now(),
        status: 'success' as const,
        isRead: false,
    },
    {
        id: 'security',
        title: 'Security Update',
        description: 'New security features have been added to your wallet.',
        timestamp: Date.now() - 86400000,
        status: 'info' as const,
        isRead: false,
    },
];

export const useNotifications = () => {
    const { account } = useWallet();

    const getStorageKeys = useCallback((address?: string) => {
        const normalizedAddress = address?.toLowerCase();
        return {
            notifications: `vechain_kit_notifications_${normalizedAddress}`,
            archived: `vechain_kit_archived_notifications_${normalizedAddress}`,
            initialized: `vechain_kit_notifications_initialized_${normalizedAddress}`,
        };
    }, []);

    const initializeNotifications = useCallback(() => {
        if (!account?.address) return;

        const keys = getStorageKeys(account.address);
        const isInitialized = localStorage.getItem(keys.initialized);

        if (!isInitialized) {
            localStorage.setItem(
                keys.notifications,
                JSON.stringify(DEFAULT_NOTIFICATIONS),
            );
            localStorage.setItem(keys.initialized, 'true');
        }
    }, [account?.address, getStorageKeys]);

    useEffect(() => {
        initializeNotifications();
    }, [initializeNotifications]);

    const getNotifications = useCallback((): Notification[] => {
        if (!account?.address) return [];

        const keys = getStorageKeys(account.address);
        const cached = localStorage.getItem(keys.notifications);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const getArchivedNotifications = useCallback((): Notification[] => {
        if (!account?.address) return [];

        const keys = getStorageKeys(account.address);
        const cached = localStorage.getItem(keys.archived);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const addNotification = useCallback(
        (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
            if (!account?.address) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const newNotification: Notification = {
                ...notification,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
                isRead: false,
            };
            localStorage.setItem(
                keys.notifications,
                JSON.stringify([newNotification, ...notifications]),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    const clearAllNotifications = useCallback(() => {
        if (!account?.address) return;

        const keys = getStorageKeys(account.address);
        const notifications = getNotifications();
        localStorage.setItem(
            keys.archived,
            JSON.stringify([...getArchivedNotifications(), ...notifications]),
        );
        localStorage.setItem(keys.notifications, JSON.stringify([]));
    }, [
        account?.address,
        getNotifications,
        getArchivedNotifications,
        getStorageKeys,
    ]);

    const markAsRead = useCallback(
        (notificationId: string) => {
            if (!account?.address) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const updatedNotifications = notifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification,
            );
            localStorage.setItem(
                keys.notifications,
                JSON.stringify(updatedNotifications),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    return {
        getNotifications,
        getArchivedNotifications,
        addNotification,
        clearAllNotifications,
        markAsRead,
    };
};
