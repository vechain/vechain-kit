/**
 * SSR-safe localStorage utilities
 * These functions safely handle localStorage access in environments where window might not be available
 */

/**
 * Safely reads a value from localStorage
 * @param key - The localStorage key to read
 * @returns The stored value or null if not found or in SSR environment
 */
export const getLocalStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Failed to read localStorage key "${key}":`, error);
        return null;
    }
};

/**
 * Safely writes a value to localStorage
 * @param key - The localStorage key to write
 * @param value - The value to store
 */
export const setLocalStorageItem = (key: string, value: string): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Failed to write localStorage key "${key}":`, error);
    }
};

