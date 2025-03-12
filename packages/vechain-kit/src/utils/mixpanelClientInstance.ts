import { VeLoginMethod, VePrivySocialLoginMethod } from '@/types';
import mixpanel from 'mixpanel-browser';

// Hardcoded Mixpanel project token to prevent overrides from the app using the kit.
// Since Mixpanel tokens are public identifiers, this is safe.
// Fetching from a server is an option but would be unnecessary complexity.
const MIXPANEL_PROJECT_TOKEN: string = '1ee28a0fa050400217dfa7f6fd630d0b';

const APP_SOURCE: string = document.title || '';

// Ensure Mixpanel is initialized only once
if (MIXPANEL_PROJECT_TOKEN) {
    mixpanel.init(MIXPANEL_PROJECT_TOKEN, { debug: true });
}

// Define interfaces for event properties
interface EventProperties {
    [key: string]: any;
}

// Define user properties structure
interface UserProperties {
    first_login_date?: string;
    last_login_date?: string;
    preferred_login_method?: VeLoginMethod;
    total_logins?: number;
    last_active?: string;
    claimed_vet_domain?: boolean;
    [key: string]: any;
}

// **Core Function to Track Events**
const trackEvent = (event: string, properties: EventProperties = {}): void => {
    mixpanel.track(event, { ...properties, source: APP_SOURCE });
};

// **Core Function to Set User Properties**
const setUserProperties = (properties: UserProperties): void => {
    mixpanel.people.set({ ...properties, source: APP_SOURCE });
};

// **Core Function to Identify Users**
const identifyUser = (userId: string): void => {
    if (userId) {
        mixpanel.identify(userId);
    }
};

// **Core Function to Increment a Property (e.g., total logins)**
const incrementUserProperty = (property: string, value: number = 1): void => {
    mixpanel.people.increment(property, value);
};

// **User Authentication & Drop-off Tracking**
const AuthTracking = {
    loginSuccess: ({
        userId,
        loginMethod,
        platform,
    }: {
        userId: string;
        loginMethod: VeLoginMethod;
        platform?: VePrivySocialLoginMethod;
    }): void => {
        identifyUser(userId);
        setUserProperties({
            last_login_date: new Date().toISOString(),
            preferred_login_method: loginMethod,
        });
        incrementUserProperty('total_logins');
        trackEvent('User Logged In', { loginMethod, platform });
    },

    loginFailed: (loginMethod: VeLoginMethod): void => {
        trackEvent('Login Failed', { loginMethod });
    },

    loginDropOff: (): void => {
        trackEvent('Login Drop-off');
    },

    preferredLoginMethod: (method: VeLoginMethod): void => {
        setUserProperties({ preferred_login_method: method });
    },
};

// **User Profile Tracking**
const UserProfileTracking = {
    trackFirstLogin: (): void => {
        setUserProperties({ first_login_date: new Date().toISOString() });
    },

    trackLastActive: (): void => {
        setUserProperties({ last_active: new Date().toISOString() });
    },

    trackVetDomainClaim: (claimed: boolean): void => {
        setUserProperties({ claimed_vet_domain: claimed });
    },
};

// **Feature Usage & Drop-off Tracking**
const FeatureUsageTracking = {
    dAppOpened: (
        dappName: 'VeBetterDAO' | 'vet.domains' | 'VeChain Kit',
    ): void => {
        trackEvent('[DApp] Opened', { dappName });
    },

    swapActivity: {
        swapPageVisited: (): void => trackEvent('Swap Clicked'),
        betterSwapLaunched: (): void => trackEvent('Launch BetterSwap'),
    },

    transactions: {
        qrCodeGenerated: (): void => trackEvent('Receive QR Generated'),
    },

    balanceRefresh: {
        balanceRefreshed: (): void => trackEvent('Balance Refresh Clicked'),
    },
};

// **Reset User Data (For Logout)**
const resetUser = (): void => {
    mixpanel.reset();
};

export {
    trackEvent,
    setUserProperties,
    identifyUser,
    incrementUserProperty,
    resetUser,
    AuthTracking,
    UserProfileTracking,
    FeatureUsageTracking,
};
