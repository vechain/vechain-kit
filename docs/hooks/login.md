# Login

## Login Hooks

The hooks provide authentication methods for VeChain applications:

### Authentication Hooks

* `useLoginWithPasskey`: Hook for authenticating using passkeys (biometric/device-based authentication)
* `useLoginWithOAuth`: Hook for authenticating using OAuth providers (Google, Twitter, Apple, Discord)
* `useLoginWithVeChain`: Hook for authenticating using VeChain wallet

### Types

```typescript
// OAuth Types
type OAuthProvider = 'google' | 'twitter' | 'apple' | 'discord';

interface OAuthOptions {
    provider: OAuthProvider;
}

interface UseLoginWithOAuthReturn {
    initOAuth: (options: OAuthOptions) => Promise<void>;
}

interface UseLoginWithPasskeyReturn {
    loginWithPasskey: () => Promise<void>;
}

interface UseLoginWithVeChainReturn {
    login: () => Promise<void>;
}
```

### Usage example

```typescript
// Example usage of Login hooks
import { 
    useLoginWithPasskey,
    useLoginWithOAuth,
    useLoginWithVeChain 
} from '@vechain/vechain-kit';

const ExampleComponent = () => {
    // Passkey authentication
    const { 
        loginWithPasskey,
    } = useLoginWithPasskey();

    // OAuth authentication
    const {
        initOAuth,
    } = useLoginWithOAuth();

    // VeChain wallet authentication
    const {
        login: loginWithVeChain,
    } = useLoginWithVeChain();

    const handlePasskeyLogin = async () => {
        try {
            await loginWithPasskey();
            console.log("Passkey login successful");
        } catch (error) {
            console.error("Passkey login failed:", error);
        }
    };

    const handleOAuthLogin = async (provider: OAuthProvider) => {
        try {
            await initOAuth({ provider });
            console.log(`${provider} OAuth login initiated`);
        } catch (error) {
            console.error("OAuth login failed:", error);
        }
    };

    const handleVeChainLogin = async () => {
        try {
            await loginWithVeChain();
            console.log("VeChain login successful");
        } catch (error) {
            console.error("VeChain login failed:", error);
        }
    };

    return (
        <div>
            {/* Passkey Login */}
            <button onClick={handlePasskeyLogin}>
                Login with Passkey
            </button>

            {/* OAuth Login Options */}
            <button onClick={() => handleOAuthLogin('google')}>
                Login with Google
            </button>
            <button onClick={() => handleOAuthLogin('twitter')}>
                Login with Twitter
            </button>
            <button onClick={() => handleOAuthLogin('apple')}>
                Login with Apple
            </button>
            <button onClick={() => handleOAuthLogin('discord')}>
                Login with Discord
            </button>

            {/* VeChain Wallet Login */}
            <button onClick={handleVeChainLogin}>
                Login with VeChain Wallet
            </button>
        </div>
    );
};

export default ExampleComponent;

/*
Note: These hooks require:
- Privy configuration for OAuth and Passkey
- Valid VeChain network configuration
- For VeChain login:
  - Valid VECHAIN_PRIVY_APP_ID
  - Proper error handling for popup blockers
  - Mobile browser compatibility handling
*/
```
