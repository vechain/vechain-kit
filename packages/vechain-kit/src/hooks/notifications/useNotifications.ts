import { useCallback, useEffect } from 'react';
// Direct import to avoid circular dependency through hooks barrel
import { useWallet } from '../api/wallet/useWallet';
import { Notification } from './types';
import { DEFAULT_NOTIFICATIONS } from './useNotificationAlerts';
import { getLocalStorageItem, setLocalStorageItem, isBrowser } from '../../utils/ssrUtils';

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
        if (!account?.address || !isBrowser()) return;

        const keys = getStorageKeys(account.address);
        const isInitialized = getLocalStorageItem(keys.initialized);

        if (!isInitialized) {
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify(DEFAULT_NOTIFICATIONS),
            );
            setLocalStorageItem(keys.initialized, 'true');
        }
    }, [account?.address, getStorageKeys]);

    useEffect(() => {
        initializeNotifications();
    }, [initializeNotifications]);

    const getNotifications = useCallback((): Notification[] => {
        if (!account?.address || !isBrowser()) return [];

        const keys = getStorageKeys(account.address);
        const cached = getLocalStorageItem(keys.notifications);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const getArchivedNotifications = useCallback((): Notification[] => {
        if (!account?.address || !isBrowser()) return [];

        const keys = getStorageKeys(account.address);
        const cached = getLocalStorageItem(keys.archived);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const addNotification = useCallback(
        (notification: Omit<Notification, 'timestamp' | 'isRead'>) => {
            if (!account?.address || !isBrowser()) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const archivedCache = getLocalStorageItem(keys.archived);
            const archivedNotifications = archivedCache ? JSON.parse(archivedCache) : [];

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
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify([newNotification, ...notifications]),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    const deleteNotification = useCallback(
        (notificationId: string) => {
            if (!account?.address || !isBrowser()) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId,
            );
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify(updatedNotifications),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    const clearAllNotifications = useCallback(() => {
        if (!account?.address || !isBrowser()) return;

        const keys = getStorageKeys(account.address);
        const notifications = getNotifications();
        setLocalStorageItem(
            keys.archived,
            JSON.stringify([...getArchivedNotifications(), ...notifications]),
        );
        setLocalStorageItem(keys.notifications, JSON.stringify([]));
    }, [
        account?.address,
        getNotifications,
        getArchivedNotifications,
        getStorageKeys,
    ]);

    const markAsRead = useCallback(
        (notificationId: string) => {
            if (!account?.address || !isBrowser()) return;

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
                setLocalStorageItem(
                    keys.notifications,
                    JSON.stringify(updatedNotifications),
                );
                setLocalStorageItem(
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
