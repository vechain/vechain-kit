import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks';

export const useSmartAccountAlert = () => {
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    const { account } = useWallet();

    const getStorageKey = (address: string) =>
        `hideSmartAccountAlert_${address?.toLowerCase()}`;

    useEffect(() => {
        if (!account?.address) return;

        const storageKey = getStorageKey(account.address);
        const alertHidden = localStorage.getItem(storageKey);

        if (alertHidden === 'true') {
            setIsAlertVisible(false);
        } else {
            setIsAlertVisible(true);
        }
    }, [account?.address]);

    const hideAlert = () => {
        if (!account?.address) return;

        const storageKey = getStorageKey(account.address);
        localStorage.setItem(storageKey, 'true');
        setIsAlertVisible(false);
    };

    return { isAlertVisible, hideAlert };
};
