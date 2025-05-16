import { useState, useEffect } from 'react';

export enum LocalStorageKey {
    CUSTOM_TOKENS = 'vechain_kit_custom_tokens',
    ECOSYSTEM_SHORTCUTS = 'vechain-kit-ecosystem-shortcuts',
    CURRENCY = 'vechain_kit_currency',
    NODE_URL = 'vechain_kit_node_url',
    NETWORK = 'vechain_kit_network',
}

export const useLocalStorage = <T>(key: LocalStorageKey, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
};
