import { useEffect } from 'react';
import { useWallet, useNotifications } from '@/hooks';
import { useTranslation } from 'react-i18next';

export const useNotificationAlerts = () => {
    const { t } = useTranslation();
    const { account, connection } = useWallet();
    const { addNotification, getNotifications } = useNotifications();

    // Smart Account Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        const hasSmartAccountNotification = notifications.some(
            (n) => n.id === `smart_account_${account.address.toLowerCase()}`,
        );

        if (!hasSmartAccountNotification) {
            addNotification({
                id: `smart_account_${account.address.toLowerCase()}`,
                title: t('Smart Account detected'),
                description: t(
                    'You have an active smart account associated to this wallet. It has been set as your main identity.',
                ),
                status: 'info',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address]);

    // Multiclause Support Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        // Only shows the new "now supported" notification to users who have seen the warning
        const hasMulticlauseWarning = notifications.some(
            (n) =>
                n.id === `multiclause_warning_${account.address.toLowerCase()}`,
        );
        const hasMulticlauseSupport = notifications.some(
            (n) =>
                n.id === `multiclause_support_${account.address.toLowerCase()}`,
        );

        // Only show the support notification if they had the warning before
        // and don't already have the support notification
        if (hasMulticlauseWarning && !hasMulticlauseSupport) {
            addNotification({
                id: `multiclause_support_${account.address.toLowerCase()}`,
                title: t('Multiclause Transactions Are Now Supported'),
                description: t(
                    'Good news! Multiclause transactions are now fully supported for smart accounts. You can now enjoy a better user experience, lower gas costs, and enchanced security.',
                ),
                status: 'info',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address]);

    // Add more notification alerts here
    // Example:
    // useEffect(() => {
    //     if (!someCondition) return;
    //     const notifications = getNotifications();
    //     if (!notifications.some(n => n.id === 'some_notification_id')) {
    //         addNotification({
    //             id: 'some_notification_id',
    //             title: t('Some Title'),
    //             description: t('Some Description'),
    //             status: 'info'
    //         });
    //     }
    // }, [someCondition]);
};
