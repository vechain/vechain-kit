import {
    EventName,
    EventPropertiesMap,
    UserProperties,
    VeLoginMethod,
    VePrivySocialLoginMethod,
} from '@/types/mixPanel';
import mixpanel from 'mixpanel-browser';

// App source for tracking origin
const APP_SOURCE: string = document.title || '';

// Environment detection
const ENV = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    isProduction: process.env.NODE_ENV === 'production',
};

// Different project tokens for different environments
const PROJECT_TOKENS = {
    development: '1ee28a0fa050400217dfa7f6fd630d0b',
    test: '1ee28a0fa050400217dfa7f6fd630d0b', // Could be different token
    production: '1ee28a0fa050400217dfa7f6fd630d0b', // Should be different token
};

const MIXPANEL_PROJECT_TOKEN = ENV.isProduction
    ? PROJECT_TOKENS.production
    : ENV.isTest
    ? PROJECT_TOKENS.test
    : PROJECT_TOKENS.development;

// Initialize Mixpanel only in browser environment
if (typeof window !== 'undefined' && MIXPANEL_PROJECT_TOKEN) {
    mixpanel.init(MIXPANEL_PROJECT_TOKEN, {
        debug: !ENV.isProduction,
        // api_host: ENV.isProduction
        //     ? 'https://api.mixpanel.com'
        //     : 'https://api-eu.mixpanel.com',
        // disable_persistence: ENV.isTest,
        // ip: false, // Don't capture IP addresses for better privacy
        // property_blacklist: ['$current_url', '$initial_referrer'], // Blacklist sensitive properties
    });

    // Development-only warning
    if (ENV.isDevelopment) {
        console.info('Analytics initialized in DEVELOPMENT mode');
    }
}

// Check if a user is logging in for the first time
const isFirstLogin = (userId: string): boolean => {
    try {
        const userDataKey = `user_data_${userId}`;
        const userData = localStorage.getItem(userDataKey);
        if (userData) {
            const parsedData = JSON.parse(userData);
            return !parsedData.first_login_date;
        }
        return true;
    } catch (e) {
        console.warn('Error checking first login status', e);
        return true;
    }
};

// Store user data in localStorage for future reference
const storeUserData = (userId: string, properties: UserProperties): void => {
    try {
        const userDataKey = `user_data_${userId}`;
        const existingData = localStorage.getItem(userDataKey);
        let userData = properties;

        if (existingData) {
            userData = { ...JSON.parse(existingData), ...properties };
        }

        localStorage.setItem(userDataKey, JSON.stringify(userData));
    } catch (e) {
        console.warn('Error storing user data', e);
    }
};

// **Core Function to Track Events**
const trackEvent = <E extends EventName>(
    event: E,
    properties: EventPropertiesMap[E] = {} as EventPropertiesMap[E],
): void => {
    try {
        if (!MIXPANEL_PROJECT_TOKEN) {
            console.warn('Analytics tracking disabled: No project token found');
            return;
        }

        // Check if we're offline
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            return;
        }

        mixpanel.track(event, { ...properties, source: APP_SOURCE });
    } catch (error) {
        console.error(`Analytics error when tracking "${event}":`, error);
    }
};

const setUserProperties = (
    properties: UserProperties,
    userId?: string,
): void => {
    try {
        mixpanel.people.set({ ...properties, source: APP_SOURCE });

        // Store in localStorage if userId is provided
        if (userId) {
            storeUserData(userId, properties);
        }
    } catch (error) {
        console.error('Error setting user properties:', error);
    }
};

const identifyUser = (userId: string): void => {
    try {
        if (!userId) {
            return;
        }

        mixpanel.identify(userId);
    } catch (error) {
        console.error('Error identifying user:', error);
    }
};

const incrementUserProperty = (property: string, value: number = 1): void => {
    try {
        mixpanel.people.increment(property, value);
    } catch (error) {
        console.error(`Error incrementing property ${property}:`, error);
    }
};

const resetUser = (): void => {
    try {
        mixpanel.reset();
    } catch (error) {
        console.error('Error resetting user:', error);
    }
};

const Analytics = {
    auth: {
        flowStarted: () => trackEvent('Auth Flow Started'),

        methodSelected: (method: VeLoginMethod) =>
            trackEvent('Login Method Selected', { loginMethod: method }),

        completed: ({
            userId,
            loginMethod,
            platform,
        }: {
            userId: string;
            loginMethod: VeLoginMethod;
            platform?: VePrivySocialLoginMethod;
        }) => {
            identifyUser(userId);
            setUserProperties(
                {
                    last_login_date: new Date().toISOString(),
                    preferred_login_method: loginMethod,
                },
                userId,
            );
            incrementUserProperty('total_logins');
            trackEvent('User Logged In', { loginMethod, platform });

            // Check if this is first login
            if (isFirstLogin(userId)) {
                Analytics.user.profile.markFirstLogin(userId);
            }
        },

        failed: (loginMethod: VeLoginMethod, reason?: string) =>
            trackEvent('Login Failed', { loginMethod, reason }),

        dropOff: (
            stage: 'wallet-connect' | 'email-verification' | 'social-callback',
        ) => trackEvent('Login Drop-off', { stage }),

        connectionListViewed: (totalConnections?: number) =>
            trackEvent('Connection List Viewed', { totalConnections }),

        walletConnectInitiated: (walletType: VeLoginMethod) =>
            trackEvent('Wallet Connect Initiated', { walletType }),

        walletDisconnected: (walletType: VeLoginMethod) =>
            trackEvent('Wallet Disconnected', { walletType }),

        logoutCompleted: () => trackEvent('Logout Completed'),

        closeConnecting: () => trackEvent('Close Connecting'),

        chainSelected: (chainName: string, fromScreen: string) =>
            trackEvent('Chain Selected', { chainName, fromScreen }),
    },

    user: {
        profile: {
            updated: (fields: string[]) =>
                trackEvent('Profile Updated', { fields }),

            markFirstLogin: (userId: string) => {
                const firstLoginDate = new Date().toISOString();
                setUserProperties({ first_login_date: firstLoginDate }, userId);
                trackEvent('First Login', { date: firstLoginDate });
            },

            markActive: (userId: string) => {
                const activeDate = new Date().toISOString();
                setUserProperties({ last_active: activeDate }, userId);
            },

            // New methods from tracking plan
            viewed: () => trackEvent('Profile Page Viewed'),

            addressCopied: (fromScreen: string) =>
                trackEvent('Address Copied', { fromScreen }),

            customiseOpened: () => trackEvent('Customise Page Opened'),
        },

        preferences: {
            updated: (preference: string, value: any) =>
                trackEvent('Preference Updated', { preference, value }),

            accountNameChanged: (newName: string) =>
                trackEvent('Account Name Changed', { newName }),
        },
    },

    swap: {
        flowStarted: (fromToken: string) =>
            trackEvent('Swap Flow Started', { fromToken }),

        tokenSelected: (position: 'from' | 'to', token: string) =>
            trackEvent('Swap Token Selected', { position, token }),

        amountEntered: (amount: string, token: string) =>
            trackEvent('Swap Amount Entered', { amount, token }),

        quoteReceived: (quote: {
            fromToken: string;
            toToken: string;
            rate: number;
            provider: string;
        }) => trackEvent('Swap Quote Received', quote),

        executed: (
            txHash: string,
            fromToken: string,
            toToken: string,
            amount: string,
        ) =>
            trackEvent('Swap Executed', { txHash, fromToken, toToken, amount }),

        completed: (txHash: string) => trackEvent('Swap Completed', { txHash }),

        failed: (reason: string, stage: 'quote' | 'approval' | 'execution') =>
            trackEvent('Swap Failed', { reason, stage }),

        buttonClicked: () => trackEvent('Swap Button Clicked'),

        pageOpened: () => trackEvent('Swap Page Opened'),

        launchBetterSwap: () => trackEvent('Launch BetterSwap'),
    },

    wallet: {
        opened: () => trackEvent('Wallet Opened'),

        scanned: () => trackEvent('QR Code Scanned'),

        received: (token: string, amount: string) =>
            trackEvent('Tokens Received', { token, amount }),

        sent: (token: string, amount: string, destination: string) =>
            trackEvent('Tokens Sent', {
                tokenSymbol: token,
                amount,
                txHash: destination,
                transactionType: 'erc20',
            }),

        balanceViewed: (tokens: string[]) =>
            trackEvent('Balance Viewed', { tokens }),

        balanceRefreshed: () => trackEvent('Balance Refreshed'),

        assetsViewed: () => trackEvent('Assets Viewed'),

        tokenSearchPerformed: (query: string, resultsCount: number) =>
            trackEvent('Token Search Performed', { query, resultsCount }),

        tokenPageViewed: (tokenSymbol: string, tokenAddress?: string) =>
            trackEvent('Token Page Viewed', { tokenSymbol, tokenAddress }),

        sendTokenInitiated: (
            tokenSymbol: string,
            recipientType: 'address' | 'domain' | 'contact',
        ) => trackEvent('Send Token Initiated', { tokenSymbol, recipientType }),

        maxTokenSelected: (tokenSymbol: string) =>
            trackEvent('Max Token Selected', { tokenSymbol }),

        tokenSent: (
            tokenSymbol: string,
            amount: string,
            txHash: string,
            transactionType: 'erc20' | 'vet',
        ) =>
            trackEvent('Token Sent', {
                tokenSymbol,
                amount,
                txHash,
                transactionType,
            }),

        receiveQRGenerated: (tokenSymbol: string) =>
            trackEvent('Receive QR Generated', { tokenSymbol }),

        addressCopied: (context: string) =>
            trackEvent('Address Copied', { context: context }),
    },

    dapp: {
        opened: (dappName: 'VeBetterDAO' | 'vet.domains' | 'VeChain Kit') =>
            trackEvent('DApp Opened', { dappName }),

        connected: (dappName: string, walletAddress: string) =>
            trackEvent('DApp Connected', {
                dappName,
                walletAddress: sanitizeProperties({ walletAddress })
                    .walletAddress,
            }),

        disconnected: (dappName: string) =>
            trackEvent('DApp Disconnected', { dappName }),

        transactionRequested: (dappName: string, transactionType: string) =>
            trackEvent('Transaction Requested', { dappName, transactionType }),

        transactionCompleted: (dappName: string, transactionType: string) =>
            trackEvent('Transaction Completed', { dappName, transactionType }),

        transactionFailed: (
            dappName: string,
            transactionType: string,
            reason: string,
            tokenType?: 'erc20' | 'vet',
        ) =>
            trackEvent('Transaction Failed', {
                dappName,
                transactionType,
                reason,
                tokenType,
            }),
    },

    bridge: {
        buttonClicked: () => trackEvent('Bridge Button Clicked'),

        pageOpened: () => trackEvent('Bridge Page Opened'),

        launchVeChainEnergy: () => trackEvent('Launch VeChain Energy'),
    },

    ecosystem: {
        buttonClicked: () => trackEvent('Ecosystem Button Clicked'),

        searchPerformed: (query: string, resultsCount: number) =>
            trackEvent('App Search Performed', { query, resultsCount }),

        appSelected: (appName: string) =>
            trackEvent('Ecosystem App Selected', { appName }),

        launchApp: (appName: string) =>
            trackEvent('Launch Ecosystem App', { appName }),

        addAppToShortcuts: (appName: string) =>
            trackEvent('Add Ecosystem App To Shortcuts', { appName }),
    },

    settings: {
        opened: (section: string) => trackEvent('Settings Opened', { section }),

        accountNameChanged: (newName: string) =>
            trackEvent('Account Name Changed', { newName }),

        accessAndSecurityViewed: () => trackEvent('Access And Security Viewed'),

        embeddedWalletViewed: () => trackEvent('Embedded Wallet Viewed'),

        manageVeBetterDAO: () => trackEvent('Manage VeBetterDAO'),

        connectionDetailsViewed: () => trackEvent('Connection Details Viewed'),
    },

    notifications: {
        cleared: () => trackEvent('Notifications Cleared'),

        archived: () => trackEvent('Notifications Archived'),
    },

    help: {
        pageViewed: () => trackEvent('Help Page Viewed'),

        faqViewed: (faqId?: string, faqTitle?: string) =>
            trackEvent('FAQ Viewed', { faqId, faqTitle }),
    },

    search: {
        queryPerformed: (
            query: string,
            section: string,
            resultsCount: number,
        ) =>
            trackEvent('Search Query Performed', {
                query,
                section,
                resultsCount,
            }),
    },

    language: {
        changed: (language: string, previousLanguage: string) =>
            trackEvent('Language Changed', { language, previousLanguage }),
    },
};

export {
    Analytics,
    updateConsent,
    getConsentSettings,
    saveConsentSettings,
    hasAnalyticsConsent,
    resetUser,
    incrementUserProperty,
    setUserProperties,
    identifyUser,
};

// Sanitize functions (placeholder - to be implemented)
const sanitizeProperties = <T extends Record<string, any>>(props: T): T => {
    // TODO: Implement property sanitization
    // This would remove PII, truncate long values, etc.
    return props;
};

// Mock consent functions (to be implemented)
const updateConsent = (settings: Record<string, boolean>): void => {
    // TODO: Implement consent management
    console.log('Consent settings updated', settings);
};

const getConsentSettings = (): Record<string, boolean> => {
    // TODO: Implement consent management
    return { analytics: true };
};

const saveConsentSettings = (settings: Record<string, boolean>): void => {
    // TODO: Implement consent management
    console.log('Consent settings saved', settings);
};

const hasAnalyticsConsent = (): boolean => {
    // TODO: Implement consent management
    return true;
};
