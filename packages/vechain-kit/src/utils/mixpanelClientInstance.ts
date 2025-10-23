import {
    AccountAction,
    AccountProperties,
    AuthAction,
    AuthProperties,
    BridgeAction,
    BridgeProperties,
    CustomizationAction,
    CustomizationProperties,
    DappKitSource,
    DropOffStage,
    EcosystemAction,
    EcosystemProperties,
    EventName,
    EventPropertiesMap,
    FAQAction,
    FAQProperties,
    NameSelectionAction,
    NameSelectionDropOffStage,
    NameSelectionProperties,
    NotificationAction,
    NotificationProperties,
    SendAction,
    SendProperties,
    SettingsAction,
    SettingsProperties,
    SwapAction,
    SwapProperties,
    UserProperties,
    VeLoginMethod,
    VePrivySocialLoginMethod,
    WalletAction,
    WalletProperties,
} from '@/types/mixPanel';
import VeChainKitMixpanel from 'mixpanel-browser';

import { ENV, getVECHAIN_KIT_MIXPANEL_PROJECT_TOKEN } from './constants';
import { getDocumentTitle, getWindowOrigin, isBrowser, isOnline, getLocalStorageItem, setLocalStorageItem } from './ssrUtils';

// Use SSR-safe getter functions instead of evaluating at module load time
const getAppSource = (): string => getDocumentTitle();
const getPageSource = (): string => getWindowOrigin();

let hasTrackingConsent = false;

// Initialize Mixpanel with basic config, but control actual tracking with consent checks
// Use a named instance to avoid conflicts with user's Mixpanel

let VeChainKitMixpanelInstance: any = null;

if (isBrowser()) {
    const token = getVECHAIN_KIT_MIXPANEL_PROJECT_TOKEN();
    if (token) {
        // named instance to avoid conflicts
        const instanceName = '__vechain_kit__';
        VeChainKitMixpanelInstance = VeChainKitMixpanel.init(
            token,
            {
                debug: !ENV.isProduction,
                persistence_name: '__vck_mp',
                // Disable automatic tracking to avoid conflicts
                track_pageview: false,
                track_links_timeout: 0,
                disable_persistence: false,
            },
            instanceName,
        );

        // Development-only warning
        if (ENV.isDevelopment) {
            console.info(
                'VeChain Kit Analytics initialized in DEVELOPMENT mode',
            );
        }
    }
}

export const setHasTrackingConsent = (consent: boolean): void => {
    hasTrackingConsent = consent;
};

// Check if a user is logging in for the first time
const isFirstLogin = (userId: string): boolean => {
    try {
        // Skip if we don't have consent
        if (!hasTrackingConsent) {
            return false;
        }

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
        // Skip if we don't have consent
        if (!hasTrackingConsent) {
            return;
        }

        const userDataKey = `user_data_${userId}`;
        const existingData = getLocalStorageItem(userDataKey);
        let userData = properties;

        if (existingData) {
            userData = { ...JSON.parse(existingData), ...properties };
        }

        setLocalStorageItem(userDataKey, JSON.stringify(userData));
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
        const token = getVECHAIN_KIT_MIXPANEL_PROJECT_TOKEN();
        if (!token) {
            console.warn('No project token found');
            return;
        }

        // Check if we're offline
        if (!isOnline()) {
            return;
        }

        // Skip tracking for non-auth events when user hasn't consented
        if (!hasTrackingConsent) {
            return;
        }

        if (VeChainKitMixpanelInstance) {
            VeChainKitMixpanelInstance.track(event, {
                ...properties,
                source: getAppSource(),
                page: getPageSource(),
            });
        }
    } catch (error) {
        console.error(`Analytics error when tracking "${event}":`, error);
    }
};

const setUserProperties = (
    properties: UserProperties,
    userId?: string,
): void => {
    try {
        // Skip if we don't have consent
        if (!hasTrackingConsent) {
            return;
        }

        // Use either provided userId or the connected wallet address
        const effectiveUserId = userId;

        if (VeChainKitMixpanelInstance) {
            VeChainKitMixpanelInstance.people.set({
                ...properties,
                source: getAppSource(),
                page: getPageSource(),
            });
        }

        // Store in localStorage if userId is provided
        if (effectiveUserId) {
            storeUserData(effectiveUserId, properties);
        }
    } catch (error) {
        console.error('Error setting user properties:', error);
    }
};

const identifyUser = (userId: string): void => {
    try {
        if (!userId || !hasTrackingConsent) {
            return;
        }

        // Always identify the user (needed for terms acceptance flow)
        if (VeChainKitMixpanelInstance) {
            VeChainKitMixpanelInstance.identify(userId);
        }
    } catch (error) {
        console.error('Error identifying user:', error);
    }
};

const incrementUserProperty = (property: string, value: number = 1): void => {
    try {
        // Skip if no consent
        if (!hasTrackingConsent) {
            return;
        }

        if (VeChainKitMixpanelInstance) {
            VeChainKitMixpanelInstance.people.increment(property, value);
        }
    } catch (error) {
        console.error(`Error incrementing property ${property}:`, error);
    }
};

const resetUser = (): void => {
    try {
        // Skip if no consent
        if (!hasTrackingConsent) {
            return;
        }

        if (VeChainKitMixpanelInstance) {
            VeChainKitMixpanelInstance.reset();
        }
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

        flowStarted: (loginMethod: VeLoginMethod) => {
            Analytics.auth.trackAuth('start', {
                loginMethod,
            });
        },

        tryAgain: (
            method: VeLoginMethod,
            platform?: VePrivySocialLoginMethod | DappKitSource | string,
        ) => {
            Analytics.auth.trackAuth('try_again', {
                loginMethod: method,
                platform,
            });
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
            platform?: VePrivySocialLoginMethod | DappKitSource;
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

        dropOff: (stage: DropOffStage, properties?: { [key: string]: any }) => {
            Analytics.auth.trackAuth('drop_off', {
                dropOffStage: stage,
                ...properties,
            });
        },

        connectionListViewed: (totalConnections?: number) => {
            Analytics.auth.trackAuth('start', { totalConnections });
        },

        walletConnectInitiated: (walletType: VeLoginMethod) => {
            Analytics.auth.trackAuth('connect_initiated', {
                loginMethod: walletType,
            });
        },

        walletDisconnectInitiated: () => {
            Analytics.auth.trackAuth('disconnect_initiated');
        },

        logoutCompleted: () => {
            Analytics.auth.trackAuth('logout');
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

            addressCopied: (fromScreen?: string) =>
                Analytics.user.profile.trackAccount('address_copied', {
                    fromScreen,
                }),

            customiseOpened: () =>
                Analytics.user.profile.trackAccount('customise_opened'),
        },
    },

    customization: {
        trackCustomization: (
            action: CustomizationAction,
            properties?: Omit<CustomizationProperties, 'action'>,
        ) => {
            trackEvent('Customization Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        started: () => {
            Analytics.customization.trackCustomization('started');
        },

        completed: (changes: {
            hasAvatar?: boolean;
            hasDisplayName?: boolean;
            hasDescription?: boolean;
            hasSocials?: boolean;
        }) => {
            Analytics.customization.trackCustomization('completed', changes);
        },

        dropOff: ({
            stage,
            reason,
            error,
        }: {
            stage: 'avatar' | 'form' | 'confirmation';
            reason?: string;
            error?: string;
        }) => {
            Analytics.customization.trackCustomization('drop_off', {
                stage,
                reason,
                error,
            });
        },

        imageUploaded: (success: boolean, error?: string) => {
            Analytics.customization.trackCustomization('image_upload', {
                success,
                error,
            });
        },

        failed: (stage: 'avatar' | 'form' | 'confirmation', error: string) => {
            Analytics.customization.trackCustomization('customization_failed', {
                stage,
                error,
            });
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

        opened: (connected: boolean) =>
            Analytics.wallet.trackWallet('view', { connected }),

        closed: (connected: boolean) =>
            Analytics.wallet.trackWallet('close', { connected }),

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

        tokenSelected: (tokenSymbol: string) =>
            Analytics.send.trackSend('token_selected', {
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

        filterByCategory: (category: string) =>
            Analytics.ecosystem.trackEcosystem('filter_by_category', {
                category,
            }),
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

        accessAndSecurityViewed: () =>
            Analytics.settings.trackSettings('security_view'),

        embeddedWalletViewed: () =>
            Analytics.settings.trackSettings('embedded_wallet_view'),

        connectionDetailsViewed: () =>
            Analytics.settings.trackSettings('connection_view'),

        generalSettingsViewed: () =>
            Analytics.settings.trackSettings('general_settings_view'),

        currencySettingsViewed: () =>
            Analytics.settings.trackSettings('currency_settings_view'),

        languageSettingsViewed: () =>
            Analytics.settings.trackSettings('language_settings_view'),

        appearanceSettingsViewed: () =>
            Analytics.settings.trackSettings('appearance_settings_view'),

        gasTokenSettingsViewed: () =>
            Analytics.settings.trackSettings('gas_token_settings_view'),

        gasTokenReordered: () =>
            Analytics.settings.trackSettings('gas_token_reordered'),

        gasTokenConfirmationToggled: (enabled: boolean) =>
            Analytics.settings.trackSettings('gas_token_confirmation_toggled', { enabled } as any),

        gasTokenCostBreakdownToggled: (enabled: boolean) =>
            Analytics.settings.trackSettings('gas_token_cost_breakdown_toggled', { enabled } as any),

        gasTokenSettingsReset: () =>
            Analytics.settings.trackSettings('gas_token_settings_reset'),

        manageSecuritySettings: () =>
            Analytics.settings.trackSettings('manage_security_settings'),

        termsAndPolicyViewed: () =>
            Analytics.settings.trackSettings('terms_and_policy_view'),

        language: {
            changed: (language: string, previousLanguage: string) =>
                Analytics.settings.trackSettings('language_changed', {
                    language,
                    previousLanguage,
                }),
        },
    },

    nameSelection: {
        trackNameSelection: (
            action: NameSelectionAction,
            properties?: Omit<NameSelectionProperties, 'action'>,
        ) => {
            trackEvent('Name Selection Flow', {
                action,
                ...properties,
                isError: !!properties?.error,
            });
        },

        started: (source: string) => {
            Analytics.nameSelection.trackNameSelection(
                'name_selection_started',
                {
                    source,
                },
            );
        },

        completed: (name: string, isOwnDomain: boolean) => {
            Analytics.nameSelection.trackNameSelection(
                'name_selection_completed',
                {
                    newName: name,
                    isOwnDomain,
                },
            );
        },

        dropOff: (
            stage: NameSelectionDropOffStage,
            properties?: {
                isError?: boolean;
                error?: string;
                name?: string;
                reason?: string;
            },
        ) => {
            Analytics.nameSelection.trackNameSelection(
                'name_selection_drop_off',
                {
                    stage,
                    ...properties,
                },
            );
        },

        failed: (
            stage: NameSelectionDropOffStage,
            properties: {
                error: string;
                name?: string;
            },
        ) => {
            Analytics.nameSelection.trackNameSelection(
                'name_selection_failed',
                {
                    stage,
                    ...properties,
                },
            );
        },

        retry: (stage: NameSelectionDropOffStage) => {
            Analytics.nameSelection.trackNameSelection('name_selection_retry', {
                stage,
            });
        },

        searched: (name: string, isAvailable: boolean) => {
            Analytics.nameSelection.trackNameSelection(
                'name_selection_searched',
                {
                    newName: name,
                    isAvailable,
                },
            );
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

        viewed: () => {
            Analytics.notifications.trackNotification('view');
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
    resetUser,
    incrementUserProperty,
    setUserProperties,
    identifyUser,
};
