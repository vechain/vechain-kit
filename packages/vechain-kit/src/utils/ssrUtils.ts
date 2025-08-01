/**
 * SSR-safe utilities for browser API access
 */

/**
 * SSR-safe localStorage getter
 */
export const getLocalStorageItem = (key: string): string | null => {
    try {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`Error accessing localStorage for key "${key}":`, error);
        return null;
    }
};

/**
 * SSR-safe localStorage setter
 */
export const setLocalStorageItem = (key: string, value: string): void => {
    try {
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn(`Error setting localStorage for key "${key}":`, error);
    }
};

/**
 * SSR-safe localStorage remover
 */
export const removeLocalStorageItem = (key: string): void => {
    try {
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`Error removing localStorage for key "${key}":`, error);
    }
};

/**
 * SSR-safe document.title getter
 */
export const getDocumentTitle = (): string => {
    try {
        return typeof document !== 'undefined' ? document.title : '';
    } catch {
        return '';
    }
};

/**
 * SSR-safe window.location.origin getter
 */
export const getWindowOrigin = (): string => {
    try {
        return typeof window !== 'undefined' && window.location
            ? window.location.origin
            : '';
    } catch {
        return '';
    }
};

/**
 * Check if we're in a browser environment
 */
export const isBrowser = (): boolean => {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * SSR-safe window.open
 */
export const safeWindowOpen = (url?: string, target?: string, features?: string): void => {
    if (isBrowser()) {
        window.open(url, target, features);
    }
};

/**
 * SSR-safe document.querySelector
 */
export const safeQuerySelector = <T extends Element>(selector: string): T | null => {
    if (typeof document !== 'undefined') {
        return document.querySelector<T>(selector);
    }
    return null;
};

/**
 * SSR-safe navigator check
 */
export const hasNavigator = (): boolean => {
    return typeof navigator !== 'undefined';
};

/**
 * SSR-safe navigator.onLine check
 */
export const isOnline = (): boolean => {
    return hasNavigator() && navigator.onLine;
};

/**
 * SSR-safe clipboard write
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (hasNavigator() && navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        return false;
    } catch (error) {
        console.warn('Error copying to clipboard:', error);
        return false;
    }
};
