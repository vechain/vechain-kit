import mixpanel from 'mixpanel-browser';

const MIXPANEL_PROJECT_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

// Ensure Mixpanel is initialized only once
if (!MIXPANEL_PROJECT_TOKEN) {
    mixpanel.init(MIXPANEL_PROJECT_TOKEN, { debug: true });
}

// **Core Function to Track Events**
const trackEvent = (event, properties = {}) => {
    mixpanel.track(event, properties);
};

// **Reset User Data (For Logout)**
const resetUser = () => {
    mixpanel.reset();
};

// **Exporting All Tracking Methods**
export default {
    trackEvent,
    resetUser,
};
