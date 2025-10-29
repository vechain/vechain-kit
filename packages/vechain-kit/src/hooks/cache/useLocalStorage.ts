import { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';

export enum LocalStorageKey {
    CUSTOM_TOKENS = 'vechain_kit_custom_tokens',
    ECOSYSTEM_SHORTCUTS = 'vechain-kit-ecosystem-shortcuts',
    CURRENCY = 'vechain_kit_currency',
    NODE_URL = 'vechain_kit_node_url',
    NETWORK = 'vechain_kit_network',
    GAS_TOKEN_PREFERENCES = 'vechain_kit_gas_token_preferences',
}

export const useLocalStorage = <T>(key: LocalStorageKey, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = getLocalStorageItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        setLocalStorageItem(key, JSON.stringify(storedValue));
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
};
