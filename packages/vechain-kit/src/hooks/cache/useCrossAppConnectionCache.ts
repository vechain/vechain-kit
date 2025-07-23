import { CrossAppConnectionCache } from '@/types';
import { useCallback } from 'react';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '@/utils/ssrUtils';

export const useCrossAppConnectionCache = () => {
    const CACHE_KEY = 'vechain_kit_cross_app_connection';

    const setConnectionCache = useCallback(
        (ecosystemApp: {
            name: string;
            logoUrl?: string;
            appId: string;
            website?: string;
        }) => {
            const cacheData: CrossAppConnectionCache = {
                timestamp: Date.now(),
                ecosystemApp,
            };
            setLocalStorageItem(CACHE_KEY, JSON.stringify(cacheData));
        },
        [],
    );

    const getConnectionCache =
        useCallback((): CrossAppConnectionCache | null => {
            const cached = getLocalStorageItem(CACHE_KEY);
            if (!cached) return null;
            return JSON.parse(cached) as CrossAppConnectionCache;
        }, []);

    const clearConnectionCache = useCallback(() => {
        removeLocalStorageItem(CACHE_KEY);
    }, []);

    return {
        setConnectionCache,
        getConnectionCache,
        clearConnectionCache,
    };
};
