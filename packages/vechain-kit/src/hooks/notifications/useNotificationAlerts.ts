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
                title: t('Multiclause Transaction temporary disabled'),
                description: t(
                    'Currently, multiclause transactions are not supported for smart accounts. Your multiclause transaction will be split into multiple transactions.',
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
