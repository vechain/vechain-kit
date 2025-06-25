import { CrossAppConnectionCache } from '@/types';
import { useCallback } from 'react';

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
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        },
        [],
    );

    const getConnectionCache =
        useCallback((): CrossAppConnectionCache | null => {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            return JSON.parse(cached) as CrossAppConnectionCache;
        }, []);

    const clearConnectionCache = useCallback(() => {
        localStorage.removeItem(CACHE_KEY);
    }, []);

    return {
        setConnectionCache,
        getConnectionCache,
        clearConnectionCache,
    };
};
