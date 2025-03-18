import mixpanel from 'mixpanel-browser';
import { VECHAIN_KIT_MIXPANEL_PROJECT_NAME } from '../constants';

const ENV = {
    isDevelopment: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'test',
    isProduction: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'main',
};

const PROJECT_TOKENS = {
    development: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    production: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
};

const MIXPANEL_PROJECT_TOKEN = ENV.isProduction
    ? PROJECT_TOKENS.production
    : PROJECT_TOKENS.development;

let homepageInstance: any;

if (typeof window !== 'undefined' && MIXPANEL_PROJECT_TOKEN) {
    homepageInstance = mixpanel.init(
        MIXPANEL_PROJECT_TOKEN,
        {
            debug: !ENV.isProduction,
        },
        VECHAIN_KIT_MIXPANEL_PROJECT_NAME,
    );
}

const trackEvent = (event: string, properties: Record<string, any> = {}) => {
    homepageInstance?.track(event, properties);
};

const resetUser = () => {
    homepageInstance?.reset();
};

export { trackEvent, resetUser };
