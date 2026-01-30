# Setup Legal Documents (optional)

To prompt users to review and accept your policies, like **Terms and Conditions**, **Privacy Policy**, or **Cookie Policy,** VeChainKit offers a simple plug-and-play solution.

You can avoid building your own if you haven't already.

By enabling also the tracking consent, you will allow VeChainKit to prompt your users to collect data to improve the kit.

***

When the `legalDocuments` option is configured, the users will see:

* **Left:** A **modal prompt** when connecting their wallet, requiring them to review and accept required and optional legal documents.
* **Right:** A **summary view** under `Settings > General > Terms and Policies`, showing which policies they’ve accepted and when.

<figure><img src="../.gitbook/assets/Subtract (1).png" alt=""><figcaption></figcaption></figure>

***

{% hint style="info" %}
**Important**

Legal document agreements are tied to the **wallet address**, **document type**, **document version**, and the **url**.

* If the `version` of any document is updated, users will be prompted to accept it again.
* Agreements are stored in the browser’s **local storage**, meaning acceptance is **per browser and device**.
* As a result, users may be prompted again if they switch browsers, devices, or clear their local storage  even if they've previously agreed on another setup.
{% endhint %}

```typescript
import { VeChainKitProvider } from '@vechain/vechain-kit';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <VeChainKitProvider
            legalDocuments={{
                allowAnalytics: true, // Enables optional consent for VeChainKit tracking

                cookiePolicy: [
                    {
                        displayName: 'MyApp Policy', // (Optional) Custom display label
                        url: 'https://www.myapp.com/cookie-policy',
                        version: 1, // Increment to re-prompt users
                        required: false, // Optional: User sees a checkbox to opt in
                    },
                ],

                privacyPolicy: [
                    {
                        url: 'https://www.myapp.com/privacy-policy',
                        version: 1, // Increment to re-prompt users
                        required: false, // Optional: can be skipped or rejected
                    },
                ],

                termsAndConditions: [
                    {
                        displayName: 'MyApp T&C',
                        url: 'https://www.myapp.com/terms-and-conditions',
                        version: 1, // Increment to re-prompt users
                        required: true, // Required: must be accepted to proceed
                    },
                ],
            }}
            // ... other props
        >
            {children}
        </VeChainKitProvider>
    );
}

```

**Key Options**

<table><thead><tr><th width="201.77734375">Option</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody><tr><td><code>allowAnalytics</code></td><td><code>boolean</code></td><td>No</td><td>If <code>true</code>, prompts users with an optional tracking policy.</td></tr><tr><td><code>cookiePolicy</code></td><td><code>array</code></td><td>No</td><td>One or more cookie policy versions.</td></tr><tr><td><code>privacyPolicy</code></td><td><code>array</code></td><td>No</td><td>One or more privacy policy versions.</td></tr><tr><td><code>termsAndConditions</code></td><td><code>array</code></td><td>No</td><td>One or more T&#x26;C versions.</td></tr></tbody></table>
