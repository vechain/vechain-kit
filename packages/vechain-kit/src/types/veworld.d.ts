/**
 * Type definitions for VeWorld in-app browser API
 * Extends the existing window.vechain type from dapp-kit
 */
declare global {
    interface Window {
        vechain?: {
            isInAppBrowser?: boolean;
            request?: (method: 'thor_switchWallet' | 'thor_disconnect' | 'thor_wallet' | 'thor_methods') => Promise<string | null | string[]>;
            [key: string]: any; // Allow other properties from dapp-kit
        };
    }
}

export {};

