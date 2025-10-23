import { useCallback, useEffect, useState, useRef } from 'react';

const STORAGE_CHANGE_EVENT = 'vechain-kit-storage-change';

export const useSyncableLocalStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return defaultValue;

        try {
            const stored = window.localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (err) {
            console.error('Error loading from localStorage:', err);
            return defaultValue;
        }
    });

    // Track if we're currently updating to prevent infinite loops
    const isUpdatingRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isUpdatingRef.current) {
            isUpdatingRef.current = false;
            return;
        }

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            
            // Dispatch custom event for same-tab sync
            window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, {
                detail: { key, value }
            }));
        } catch (err) {
            console.error('Error writing to localStorage:', err);
        }
    }, [key, value]);

    // Listen for storage changes from other components
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = (e: StorageEvent) => {
            // Cross-tab changes (standard storage event)
            if (e.key === key && e.newValue) {
                try {
                    const newValue = JSON.parse(e.newValue);
                    // Only update if value is different
                    if (JSON.stringify(newValue) !== JSON.stringify(value)) {
                        isUpdatingRef.current = true;
                        setValue(newValue);
                    }
                } catch (err) {
                    console.error('Error parsing storage value:', err);
                }
            }
        };

        const handleCustomStorageChange = ((e: CustomEvent) => {
            // Same-tab changes (custom event)
            if (e.detail.key === key) {
                try {
                    const stored = window.localStorage.getItem(key);
                    if (stored) {
                        const newValue = JSON.parse(stored);
                        // Only update if value is different
                        if (JSON.stringify(newValue) !== JSON.stringify(value)) {
                            isUpdatingRef.current = true;
                            setValue(newValue);
                        }
                    }
                } catch (err) {
                    console.error('Error parsing storage value:', err);
                }
            }
        }) as EventListener;

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(STORAGE_CHANGE_EVENT, handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustomStorageChange);
        };
    }, [key, value]);

    //Manual sync localStorage and update state
    const sync = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const stored = window.localStorage.getItem(key);
            const newValue = stored ? JSON.parse(stored) : defaultValue;
            if (JSON.stringify(newValue) !== JSON.stringify(value)) {
                setValue(newValue);
            }
        } catch (err) {
            console.error('Error syncing localStorage:', err);
        }
    }, [key, defaultValue, value]);

    //Get value directly from localStorage
    const getValue: () => T = useCallback(() => {
        if (typeof window === 'undefined') return defaultValue;
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    }, [key, defaultValue]);

    return [value, setValue, sync, getValue] as const;
};
