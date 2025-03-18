import mixpanel from 'mixpanel-browser';
import {
    ENV,
    HOMEPAGE_MIXPANEL_PROJECT_NAME,
    HOMEPAGE_MIXPANEL_PROJECT_TOKEN,
} from '../constants';

let homepageInstance: any;

if (typeof window !== 'undefined' && HOMEPAGE_MIXPANEL_PROJECT_TOKEN) {
    homepageInstance = mixpanel.init(
        HOMEPAGE_MIXPANEL_PROJECT_TOKEN,
        {
            debug: !ENV.isProduction,
        },
        HOMEPAGE_MIXPANEL_PROJECT_NAME,
    );
}

const trackEvent = (event: string, properties: Record<string, any> = {}) => {
    homepageInstance?.track(event, properties);
};

const resetUser = () => {
    homepageInstance?.reset();
};

export { trackEvent, resetUser };
