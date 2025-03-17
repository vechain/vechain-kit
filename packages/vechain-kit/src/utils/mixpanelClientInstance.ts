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
    SettingsAction,
    SettingsProperties,
    WalletAction,
    WalletProperties,
    SendAction,
    SendProperties,
    EcosystemAction,
    EcosystemProperties,
    SwapAction,
    SwapProperties,
    BridgeAction,
    BridgeProperties,
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
            console.warn('No project token found');
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
        trackSwap: (
            action: SwapAction,
            properties?: Omit<SwapProperties, 'action'>,
        ) => {
            trackEvent('Swap Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        opened: () => Analytics.swap.trackSwap('view'),

        buttonClicked: () => Analytics.swap.trackSwap('button_click'),

        launchBetterSwap: () => Analytics.swap.trackSwap('launch_better_swap'),
    },

    wallet: {
        trackWallet: (
            action: WalletAction,
            properties?: Omit<WalletProperties, 'action'>,
        ) => {
            trackEvent('Wallet Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        opened: () => Analytics.wallet.trackWallet('view'),

        balanceRefreshed: () => Analytics.wallet.trackWallet('balance_refresh'),

        assetsViewed: () => Analytics.wallet.trackWallet('assets_view'),

        maxTokenSelected: (tokenSymbol: string) =>
            Analytics.wallet.trackWallet('max_token_selected', { tokenSymbol }),

        receiveQRGenerated: () =>
            Analytics.wallet.trackWallet('receive_qr_generated'),

        addressCopied: (context: string) =>
            Analytics.wallet.trackWallet('address_copied', { context }),
    },

    send: {
        trackSend: (
            action: SendAction,
            properties: Omit<SendProperties, 'action'> & {},
        ) => {
            trackEvent('Send Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        initiated: (
            tokenSymbol: string,
            recipientType: 'address' | 'domain' | 'contact',
        ) =>
            Analytics.send.trackSend('initiated', {
                tokenSymbol,
                recipientType,
            }),

        completed: (
            tokenSymbol: string,
            amount: string,
            txHash: string,
            transactionType: 'erc20' | 'vet',
        ) =>
            Analytics.send.trackSend('completed', {
                tokenSymbol,
                amount,
                txHash,
                transactionType,
            }),

        flow: (
            action: Exclude<SendAction, 'initiated' | 'completed'>,
            properties: Omit<SendProperties, 'action'>,
        ) => {
            Analytics.send.trackSend(action, properties);
        },

        tokenSearchPerformed: (query: string) =>
            Analytics.send.trackSend('token_search', {
                query,
            }),

        tokenPageViewed: (tokenSymbol: string) =>
            Analytics.send.trackSend('token_page_view', {
                tokenSymbol,
            }),
    },

    bridge: {
        trackBridge: (
            action: BridgeAction,
            properties?: Omit<BridgeProperties, 'action'>,
        ) => {
            trackEvent('Bridge Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        opened: () => Analytics.bridge.trackBridge('view'),

        buttonClicked: () => Analytics.bridge.trackBridge('button_click'),

        launchVeChainEnergy: () =>
            Analytics.bridge.trackBridge('launch_vechain_energy'),
    },

    ecosystem: {
        trackEcosystem: (
            action: EcosystemAction,
            properties?: Omit<EcosystemProperties, 'action'>,
        ) => {
            trackEvent('Ecosystem Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        opened: () => Analytics.ecosystem.trackEcosystem('view'),

        buttonClicked: () => Analytics.ecosystem.trackEcosystem('button_click'),

        searchPerformed: (query: string, resultsCount: number) =>
            Analytics.ecosystem.trackEcosystem('search', {
                query,
                resultsCount,
            }),

        appSelected: (appName: string) =>
            Analytics.ecosystem.trackEcosystem('app_select', { appName }),

        launchApp: (appName: string) =>
            Analytics.ecosystem.trackEcosystem('app_launch', { appName }),

        addAppToShortcuts: (appName: string) =>
            Analytics.ecosystem.trackEcosystem('add_shortcut', { appName }),
    },

    settings: {
        trackSettings: (
            action: SettingsAction,
            properties?: Omit<SettingsProperties, 'action'>,
        ) => {
            trackEvent('Settings Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        opened: (section: string) =>
            Analytics.settings.trackSettings('view', { section }),

        accountNameChanged: (newName: string) =>
            Analytics.settings.trackSettings('name_changed', { newName }),

        accessAndSecurityViewed: () =>
            Analytics.settings.trackSettings('security_view'),

        embeddedWalletViewed: () =>
            Analytics.settings.trackSettings('embedded_wallet_view'),

        manageVeBetterDAO: () =>
            Analytics.settings.trackSettings('vebetterdao_manage'),

        connectionDetailsViewed: () =>
            Analytics.settings.trackSettings('connection_view'),

        language: {
            changed: (language: string, previousLanguage: string) =>
                Analytics.settings.trackSettings('language_changed', {
                    language,
                    previousLanguage,
                }),
        },
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
