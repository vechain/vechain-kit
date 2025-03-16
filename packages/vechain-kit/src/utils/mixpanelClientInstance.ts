import {
    EventName,
    EventPropertiesMap,
    UserProperties,
    VeLoginMethod,
    VePrivySocialLoginMethod,
    NotificationAction,
    NotificationProperties,
    AuthAction,
    AuthProperties,
    FAQAction,
    FAQProperties,
    AccountAction,
    AccountProperties,
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
        trackAuth: (
            action: AuthAction,
            properties?: Omit<AuthProperties, 'action'>,
        ) => {
            trackEvent('Auth Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        flowStarted: () => {
            Analytics.auth.trackAuth('start');
        },

        methodSelected: (method: VeLoginMethod) => {
            Analytics.auth.trackAuth('method_selected', {
                loginMethod: method,
            });
        },

        completed: ({
            userId,
            loginMethod,
            platform,
        }: {
            userId?: string;
            loginMethod: VeLoginMethod;
            platform?: VePrivySocialLoginMethod;
        }) => {
            if (userId) {
                identifyUser(userId);
                setUserProperties(
                    {
                        last_login_date: new Date().toISOString(),
                        preferred_login_method: loginMethod,
                    },
                    userId,
                );
                if (isFirstLogin(userId)) {
                    Analytics.user.profile.markFirstLogin(userId);
                }
            }
            incrementUserProperty('total_logins');
            Analytics.auth.trackAuth('connect_success', {
                loginMethod,
                platform,
            });
        },

        failed: (loginMethod: VeLoginMethod, reason?: string) => {
            Analytics.auth.trackAuth('connect_failed', {
                loginMethod,
                error: reason,
            });
        },

        dropOff: (
            stage: 'wallet-connect' | 'email-verification' | 'social-callback',
        ) => {
            Analytics.auth.trackAuth('drop_off', { dropOffStage: stage });
        },

        connectionListViewed: (totalConnections?: number) => {
            Analytics.auth.trackAuth('start', { totalConnections });
        },

        walletConnectInitiated: (walletType: VeLoginMethod) => {
            Analytics.auth.trackAuth('connect_initiated', {
                loginMethod: walletType,
            });
        },

        walletDisconnected: (walletType: VeLoginMethod) => {
            Analytics.auth.trackAuth('logout', { loginMethod: walletType });
        },

        logoutCompleted: () => {
            Analytics.auth.trackAuth('logout');
        },

        chainSelected: (chainName: string, fromScreen: string) => {
            Analytics.auth.trackAuth('chain_selected', {
                chainName,
                fromScreen,
            });
        },
    },

    user: {
        profile: {
            trackAccount: (
                action: AccountAction,
                properties?: Omit<AccountProperties, 'action'>,
            ) => {
                trackEvent('Account Flow', {
                    action,
                    ...properties,
                    isError: !!properties?.error,
                });
            },

            updated: (fields: string[]) =>
                Analytics.user.profile.trackAccount('settings_updated', {
                    fields,
                }),

            markFirstLogin: (userId: string) => {
                const firstLoginDate = new Date().toISOString();
                setUserProperties({ first_login_date: firstLoginDate }, userId);
                trackEvent('First Login', { date: firstLoginDate });
            },

            markActive: (userId: string) => {
                const activeDate = new Date().toISOString();
                setUserProperties({ last_active: activeDate }, userId);
            },

            viewed: () => Analytics.user.profile.trackAccount('view'),

            addressCopied: (fromScreen: string) =>
                Analytics.user.profile.trackAccount('address_copied', {
                    fromScreen,
                }),

            customiseOpened: () =>
                Analytics.user.profile.trackAccount('customise_opened'),
        },

        preferences: {
            updated: (preference: string) =>
                Analytics.user.profile.trackAccount('settings_updated', {
                    fields: [preference],
                }),

            accountNameChanged: (newName: string) =>
                Analytics.user.profile.trackAccount('name_changed', {
                    newName,
                }),
        },
    },

    swap: {
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

        trackSendFlow: (
            stage:
                | 'token-select'
                | 'amount'
                | 'recipient'
                | 'review'
                | 'confirmation',
            properties: {
                tokenSymbol: string;
                amount?: string;
                recipientAddress?: string;
                recipientType?: 'address' | 'domain' | 'contact';
                error?: string;
            },
        ) => {
            trackEvent('Send Flow', {
                stage,
                ...properties,
                isError: !!properties.error,
            });
        },

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

        receiveQRGenerated: () => trackEvent('Receive QR Generated'),

        addressCopied: (context: string) =>
            trackEvent('Address Copied', { context: context }),
    },

    bridge: {
        buttonClicked: () => trackEvent('Bridge Button Clicked'),

        pageOpened: () => trackEvent('Bridge Page Opened'),

        launchVeChainEnergy: () => trackEvent('Launch VeChain Energy'),
    },

    ecosystem: {
        pageOpened: () => trackEvent('Ecosystem Page Opened'),
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
        trackNotification: (
            action: NotificationAction,
            properties?: Omit<NotificationProperties, 'action'>,
        ) => {
            trackEvent('Notification Flow', {
                action,
                ...properties,
            });
        },

        viewed: (
            notificationType?: string,
            totalCount?: number,
            unreadCount?: number,
        ) => {
            Analytics.notifications.trackNotification('view', {
                notificationType:
                    notificationType as NotificationProperties['notificationType'],
                totalCount,
                unreadCount,
                viewType: 'current',
            });
        },

        cleared: (notificationType?: string, count?: number) => {
            Analytics.notifications.trackNotification('clear', {
                notificationType:
                    notificationType as NotificationProperties['notificationType'],
                totalCount: count,
            });
        },

        archived: (notificationType?: string) => {
            Analytics.notifications.trackNotification('archive', {
                notificationType:
                    notificationType as NotificationProperties['notificationType'],
            });
        },

        toggleView: (viewType: 'current' | 'archived') => {
            Analytics.notifications.trackNotification('toggle_view', {
                viewType,
            });
        },

        clicked: (notificationType?: string) => {
            Analytics.notifications.trackNotification('click', {
                notificationType:
                    notificationType as NotificationProperties['notificationType'],
            });
        },

        dismissed: (notificationType?: string) => {
            Analytics.notifications.trackNotification('dismiss', {
                notificationType:
                    notificationType as NotificationProperties['notificationType'],
            });
        },
    },

    help: {
        trackFAQ: (
            action: FAQAction,
            properties?: Omit<FAQProperties, 'action'>,
        ) => {
            trackEvent('FAQ Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        pageViewed: () => Analytics.help.trackFAQ('view'),

        faqViewed: (faqId?: string, faqTitle?: string) =>
            Analytics.help.trackFAQ('faq_opened', { faqId, faqTitle }),

        categorySelected: (category: string) =>
            Analytics.help.trackFAQ('category_selected', { category }),

        questionExpanded: (faqId: string, faqTitle: string) =>
            Analytics.help.trackFAQ('question_expanded', { faqId, faqTitle }),

        searchPerformed: (searchQuery: string, resultsCount: number) =>
            Analytics.help.trackFAQ('search', { searchQuery, resultsCount }),
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
// const sanitizeProperties = <T extends Record<string, any>>(props: T): T => {
//     // TODO: Implement property sanitization
//     // This would remove PII, truncate long values, etc.
//     return props;
// };

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
