// src/hooks/useFeatureAnnouncement.ts
import { useState, useEffect } from 'react';

export const useFeatureAnnouncement = () => {
    const [isVisible, setIsVisible] = useState(true);
    const CACHE_KEY = 'vechain_kit_feature_announcement_closed';

    useEffect(() => {
        const isClosed = localStorage.getItem(CACHE_KEY);
        if (isClosed) {
            setIsVisible(false);
        }
    }, []);

    const closeAnnouncement = () => {
        localStorage.setItem(CACHE_KEY, 'true');
        setIsVisible(false);
    };

    return {
        isVisible,
        closeAnnouncement,
    };
};
