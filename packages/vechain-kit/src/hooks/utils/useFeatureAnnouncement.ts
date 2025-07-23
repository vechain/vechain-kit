import { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';

export const useFeatureAnnouncement = () => {
    const [isVisible, setIsVisible] = useState(true);
    const CACHE_KEY = 'vechain_kit_feature_announcement_closed';

    useEffect(() => {
        const isClosed = getLocalStorageItem(CACHE_KEY);
        if (isClosed) {
            setIsVisible(false);
        }
    }, []);

    const closeAnnouncement = () => {
        setLocalStorageItem(CACHE_KEY, 'true');
        setIsVisible(false);
    };

    return {
        isVisible,
        closeAnnouncement,
    };
};
