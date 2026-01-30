# Wallet

The `useWallet` hook provides a unified interface for managing wallet connections in a VeChain application, supporting multiple connection methods including social logins (via Privy), direct wallet connections (via DappKit), and cross-application connections.

This will be the hook you will use more frequently and it provides quite a few useful informations.

### Usage

```typescript
import { useWallet } from "@vechain/vechain-kit"; 

function MyComponent = () => {
    const {
        account,
        connectedWallet,
        smartAccount,
        privyUser,
        connection,
        disconnect
    } = useWallet();
    
    return <></>
}


```

### Types

{% tabs %}
{% tab title="Wallet" %}
```typescript
export type Wallet = {
    address: string;
    domain?: string;
    image: string;
} | null;
```
{% endtab %}

{% tab title="SmartAccount" %}
```typescript
export type SmartAccount = Wallet & {
    isDeployed: boolean;
    isActive: boolean;
    version: string | null;
};
```
{% endtab %}

{% tab title="Connection source" %}
```typescript
export type ConnectionSource = {
    type: 'privy' | 'wallet' | 'privy-cross-app';
    displayName: string;
};
```
{% endtab %}

{% tab title="PrivyUser" %}
```typescript
interface User {
    /** The Privy-issued DID for the user. If you need to store additional information
     * about a user, you can use this DID to reference them. */
    id: string;
    /** The datetime of when the user was created. */
    createdAt: Date;
    /** The user's email address, if they have linked one. It cannot be linked to another user. */
    email?: Email;
    /** The user's phone number, if they have linked one. It cannot be linked to another user. */
    phone?: Phone;
    /** The user's most recently linked wallet, if they have linked at least one wallet.
     *  It cannot be linked to another user.
     *  This wallet is the wallet that will be used for transactions and signing if it is connected.
     **/
    wallet?: Wallet;
    /**
     * The user's smart wallet, if they have set up through the Privy Smart Wallet SDK.
     */
    smartWallet?: SmartWallet;
    /** The user's Google account, if they have linked one. It cannot be linked to another user. */
    google?: Google;
    /** The user's Twitter account, if they have linked one. It cannot be linked to another user. */
    twitter?: Twitter;
    /** The user's Discord account, if they have linked one. It cannot be linked to another user. */
    discord?: Discord;
    /** The user's Github account, if they have linked one. It cannot be linked to another user. */
    github?: Github;
    /** The user's Spotify account, if they have linked one. It cannot be linked to another user. */
    spotify?: Spotify;
    /** The user's Instagram account, if they have linked one. It cannot be linked to another user. */
    instagram?: Instagram;
    /** The user's Tiktok account, if they have linked one. It cannot be linked to another user. */
    tiktok?: Tiktok;
    /** The user's LinkedIn account, if they have linked one. It cannot be linked to another user. */
    linkedin?: LinkedIn;
    /** The user's Apple account, if they have linked one. It cannot be linked to another user. */
    apple?: Apple;
    /** The user's Farcaster account, if they have linked one. It cannot be linked to another user. */
    farcaster?: Farcaster;
    /** The user's Telegram account, if they have linked one. It cannot be linked to another user. */
    telegram?: Telegram;
    /** The list of accounts associated with this user. Each account contains additional metadata
     * that may be helpful for advanced use cases. */
    linkedAccounts: Array<LinkedAccountWithMetadata>;
    /** The list of MFA Methods associated with this user. */
    mfaMethods: Array<MfaMethod>;
    /**
     * Whether or not the user has explicitly accepted the Terms and Conditions
     * and/or Privacy Policy
     */
    hasAcceptedTerms: boolean;
    /** Whether or not the user is a guest */
    isGuest: boolean;
    /** Custom metadata field for a given user account */
    customMetadata?: CustomMetadataType;
}
```
{% endtab %}
{% endtabs %}

### Return values

#### `account: Wallet`

The primary account being used. This will be either:

* The smart account (if connected via Privy)
* The wallet address (if connected via DappKit)

#### `smartAccount: SmartAccount`

Information about the user's smart account:

* `address`: The smart account address
* `domain`: Associated VeChain domain name
* `image`: Generated avatar image
* `isDeployed`: Whether the smart account is deployed; smart accounts can be deployed on demand to avoid spending money on non active users. Learn more about smart accounts [here](wallet.md#smartaccount).
* `isActive`: Whether this is the currently active account
* `version`: Smart account contract version

When the user is connected with Privy `account` will always be equal to the `smartAccount`.

#### `connectedWallet: Wallet`

The currently connected wallet, regardless of connection method (can be both a Privy Embedded Wallet or a self custody Wallet connected trough VeWorld or Sync2):

* `address`: Wallet address
* `domain`: Associated VeChain domain name
* `image`: Generated avatar image

#### `privyUser: User | null`

The Privy user object if connected via Privy, null otherwise

#### `connection: ConnectionState`

Current connection state information:

* `isConnected`: Overall connection status
* `isLoading`: Whether connection is in progress
* `isConnectedWithSocialLogin`: Connected via Privy (no crossapp)
* `isConnectedWithDappKit`: Connected via DappKit
* `isConnectedWithCrossApp`: Connected via cross-app
* `isConnectedWithPrivy`: Connected via Privy (social or cross-app)
* `isConnectedWithVeChain`: Connected with VeChain cross-app
* `source`: Connection source information
* `isInAppBrowser`: Whether your app is running in VeWorld app browser
* `nodeUrl`: Current node URL (if provided by you in the provider, otherwise default in use by VeChain Kit)
* `delegatorUrl`: Fee delegation service URL setted by you in the provider
* `chainId`: Current chain ID
* `network`: Network type (mainnet/testnet/custom)

#### `disconnect(): Promise<void>`

This function terminates the current wallet connection, ensuring cleanup of connection details and triggering necessary event listeners for state updates.

### Connection Sources

The hook supports three main connection types:

1. **Social Login** (`privy`): Authentication via social providers with your own APP\_ID
2. **Wallet Connection** (`wallet`): Direct wallet connection via DappKit
3. **Cross-App** (`privy-cross-app`): Connection through ecosystem integration

### Events

The hook dispatches a `wallet_disconnected` event when the wallet is disconnected, which can be used to trigger UI updates in dependent components.
