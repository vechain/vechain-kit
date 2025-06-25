import { useCallback, useEffect } from 'react';
import { useWallet } from '@/hooks';
import { Notification } from './types';
import { DEFAULT_NOTIFICATIONS } from './useNotificationAlerts';

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
        (notification: Omit<Notification, 'timestamp' | 'isRead'>) => {
            if (!account?.address) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const archivedNotifications = JSON.parse(
                localStorage.getItem(keys.archived) || '[]',
            );

            // Check if notification exists in either active or archived notifications
            const isDuplicate = [
                ...notifications,
                ...archivedNotifications,
            ].some((n) => n.title === notification.title);
            if (isDuplicate) return;

            const newNotification: Notification = {
                ...notification,
                id: notification.id || Math.random().toString(36).substring(7),
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

    const deleteNotification = useCallback(
        (notificationId: string) => {
            if (!account?.address) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId,
            );
            localStorage.setItem(
                keys.notifications,
                JSON.stringify(updatedNotifications),
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
            const archivedNotifications = getArchivedNotifications();

            // Find the notification to archive
            const notificationToArchive = notifications.find(
                (n) => n.id === notificationId,
            );

            // Update notifications list - remove the archived one
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId,
            );

            // Add to archived list if found
            if (notificationToArchive) {
                const updatedArchivedNotifications = [
                    { ...notificationToArchive, isRead: true },
                    ...archivedNotifications,
                ];

                // Update both lists in localStorage
                localStorage.setItem(
                    keys.notifications,
                    JSON.stringify(updatedNotifications),
                );
                localStorage.setItem(
                    keys.archived,
                    JSON.stringify(updatedArchivedNotifications),
                );
            }
        },
        [
            account?.address,
            getNotifications,
            getArchivedNotifications,
            getStorageKeys,
        ],
    );

    return {
        getNotifications,
        getArchivedNotifications,
        addNotification,
        clearAllNotifications,
        markAsRead,
        deleteNotification,
    };
};
