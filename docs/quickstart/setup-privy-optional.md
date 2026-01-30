# Setup Privy (optional)

If you have your own Privy app, you can pass an additional prop with your settings.

```javascript
import { VeChainKitProvider } from '@vechain/vechain-kit';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <VeChainKitProvider
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: ['google', 'twitter', 'sms', 'email'],
                appearance: {
                    walletList: ['metamask', 'rainbow'],
                    accentColor: '#696FFD',
                    loginMessage: 'Select a social media profile',
                    logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
                allowPasskeyLinking: true,
            }}
            ...
            //other props
        >
            {children}
        </VeChainKitProvider>
    );
}
```

Go to[ privy.io](https://privy.io) and create an app. You will find the APP ID and the CLIENT ID in the **App Settings** tab.

For further information on how to implement Privy SDK please refer to their docs: [https://docs.privy.io/](https://docs.privy.io/)

This project uses:

* [_@privy-io/react-auth_](https://www.npmjs.com/package/@privy-io/react-auth) for Privy connection type
* [_@privy-io/cross-app-connect_](https://www.npmjs.com/package/@privy-io/cross-app-connect) for ecosystem cross app connection

You can import privy from the kit as&#x20;

```typescript
import { usePrivy } from "@vechain/vechain-kit";

const { user } = usePrivy();
```

{% hint style="warning" %}
If you setup your own Privy be sure to go over the recommended security settings provided by Privy: \
[https://docs.privy.io/guide/security/implementation/](https://docs.privy.io/guide/security/implementation/) and [https://docs.privy.io/guide/security/implementation/csp](https://docs.privy.io/guide/security/implementation/csp)
{% endhint %}

{% hint style="info" %}
**Pros of self hosting Privy:**

* No UI confirmations on users transactions
* Allow your users to backup their keys and update security settings directly in your app
* Targetted social login methods

**Cons:**

* Price
* Responsibilities to correctly secure your Privy account, since it contains access to user's wallet settings
* Your users will need to login into other apps through ecosystem mode
{% endhint %}
