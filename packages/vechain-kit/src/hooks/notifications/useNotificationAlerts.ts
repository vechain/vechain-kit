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
                    'You have an active smart account associated to your wallet. It will be used as a gateway for your blockchain interactions.',
                ),
                status: 'info',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address]);

    // Multiclause Warning Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        const hasMulticlauseWarning = notifications.some(
            (n) =>
                n.id === `multiclause_warning_${account.address.toLowerCase()}`,
        );

        if (!hasMulticlauseWarning) {
            addNotification({
                id: `multiclause_warning_${account.address.toLowerCase()}`,
                title: t('Multiclause Transactions Limited'),
                description: t(
                    'Currently, multiclause transactions are not supported for smart accounts and will be split into multiple transactions. This feature is being worked on.',
                ),
                status: 'warning',
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
