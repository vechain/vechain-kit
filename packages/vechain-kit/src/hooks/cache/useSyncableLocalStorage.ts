import { useCallback, useEffect, useState } from 'react';

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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error('Error writing to localStorage:', err);
        }
    }, [key, value]);

    //Manual sync localStorage and update state
    const sync = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const stored = window.localStorage.getItem(key);
            setValue(stored ? JSON.parse(stored) : defaultValue);
        } catch (err) {
            console.error('Error syncing localStorage:', err);
        }
    }, [key, defaultValue]);

    //Get value directly from localStorage
    const getValue: () => T = useCallback(() => {
        if (typeof window === 'undefined') return defaultValue;
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    }, [key, defaultValue]);

    return [value, setValue, sync, getValue] as const;
};
