# Login Customisation

This guide covers all available authentication methods in VeChain Kit. Choose the approach that best fits your application's needs.

### Overview

VeChain Kit provides four main authentication approaches:

1. **Pre-built WalletButton Component** - Fastest implementation with automatic state management
2. **Custom Authentication UI** - Full control over design and user experience
3. **OAuth Social Login** - Integrate with social providers (Privy self-hosted only)
4. **Wallet-Only Connection** - Direct wallet connection without social options

### Method 1: Using the WalletButton Component

The simplest way to add authentication is using the pre-built `WalletButton` component. It automatically handles:

* Connection state management
* Login/logout button switching
* User profile display when connected

```typescript
'use client';

import { WalletButton } from '@vechain/vechain-kit';

export function Page() {
    return (
        <WalletButton />
    );
}
```

For styling and customization options, see the WalletButton documentation.

### Method 2: Building Custom Authentication UI

For complete control over the authentication experience, create a custom implementation using the provided hooks:

```typescript
'use client';

import { useConnectModal, useAccountModal, useWallet } from '@vechain/vechain-kit';

export function CustomAuthButton() {
    const { connection } = useWallet();
    
    const { 
        open: openConnectModal, 
        close: closeConnectModal, 
        isOpen: isConnectModalOpen 
    } = useConnectModal();
    
    const { 
        open: openAccountModal, 
        close: closeAccountModal, 
        isOpen: isAccountModalOpen 
    } = useAccountModal();
    
    if (!connection.isConnected) {
        return (
            <button onClick={openConnectModal}>
                Connect Wallet
            </button>
        );
    }
    
    return (
        <button onClick={openAccountModal}>
            View Account
        </button>
    );
}
```

### Method 3: OAuth Social Login (Self-Hosted Privy Only)

For applications using self-hosted Privy, you can implement OAuth authentication with popular social providers:

```typescript
import { useLoginWithOAuth } from '@vechain/vechain-kit';

const SocialLoginComponent = () => {
    const { initOAuth } = useLoginWithOAuth();

    const handleOAuthLogin = async (provider: OAuthProvider) => {
        try {
            await initOAuth({ provider });
            console.log(`${provider} OAuth login initiated`);
        } catch (error) {
            console.error("OAuth login failed:", error);
        }
    };

    return (
        <div className="social-login-container">
            <h3>Sign in with:</h3>
            <div className="social-buttons">
                <button onClick={() => handleOAuthLogin('google')}>
                    <GoogleIcon /> Google
                </button>
                <button onClick={() => handleOAuthLogin('twitter')}>
                    <TwitterIcon /> Twitter
                </button>
                <button onClick={() => handleOAuthLogin('apple')}>
                    <AppleIcon /> Apple
                </button>
                <button onClick={() => handleOAuthLogin('discord')}>
                    <DiscordIcon /> Discord
                </button>
            </div>
        </div>
    );
};

export default SocialLoginComponent;
```

#### Supported OAuth Providers

* Google
* Twitter (X)
* Apple
* Discord
* GitHub
* LinkedIn

For detailed OAuth configuration, see the [Login Hooks documentation](../hooks/login.md).

### Method 4: Wallet-Only Connection

To restrict authentication to wallet connections only (bypassing social login options):

```typescript
import { useDAppKitWalletModal } from '@vechain/vechain-kit';

export const WalletOnlyLogin = () => {
    const { open: openWalletModal } = useDAppKitWalletModal();

    return (
        <button onClick={openWalletModal}>
            Connect Wallet
        </button>
    );
};
```

This method is useful when:

* Your app requires only crypto wallet authentication
* You want to bypass social login options
* You need a streamlined wallet-focused experience

### Special Considerations

#### VeWorld Mobile Integration

When your application is accessed through the VeWorld mobile wallet browser, VeWorld is automatically enforced as the primary authentication method. This ensures seamless integration with the mobile wallet experience.

#### Authentication State Management

All authentication methods automatically sync with the VeChain Kit provider, ensuring consistent state across your application. You can access the current authentication state using:

```typescript
import { useWallet } from '@vechain/vechain-kit';

function Component() {
    const { connection, address, source } = useWallet();
    
    if (connection.isConnected) {
        console.log('Connected wallet:', address);
        console.log('Connection source:', source);
    }
}
```

#### Error Handling

Always implement proper error handling for authentication flows:

```typescript
const handleConnect = async () => {
    try {
        await openConnectModal();
    } catch (error) {
        console.error('Connection failed:', error);
        // Show user-friendly error message
    }
};
```

### Next Steps

* Customize the WalletButton appearance
* Learn about authentication hooks
* Handle wallet interactions
* Implement transaction signing
