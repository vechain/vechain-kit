# Open targeted modals

The hooks provide tools for managing various modals in the VeChain application:

{% hint style="success" %}
Use the { isolatedView: true } prop to show to not allow the user to browse other sections of the kit.
{% endhint %}

### Account Related Modals

* `useAccountModal`: Core account modal management
* `useProfileModal`: Show the user only his profile, with customize and logout option
* `useAccountCustomizationModal`: Account customization settings
* `useAccessAndSecurityModal`: Security settings and access management
* `useChooseNameModal`: Account name selection
* `useUpgradeSmartAccountModal`: Smart account upgrade management

### Wallet & Connection Modals

* `useConnectModal`: Wallet connection modal
* `useWalletModal`: Combined wallet management modal
* `useLoginModalContent`: Login modal content configuration

### Transaction Modals

* `useTransactionModal`: Transaction confirmation and status
* `useTransactionToast`: Transaction notifications
* `useSendTokenModal`: Token transfer interface
* `useReceiveModal`: Token receiving interface

### Additional Feature Modals

* `useExploreEcosystemModal`: VeChain ecosystem explorer
* `useNotificationsModal`: Notification center
* `useFAQModal`: Frequently asked questions

### Types

```typescript
// Modal Types
interface ModalHookReturn {
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

type LoginMethod = 'ecosystem' | 'vechain' | 'dappkit' | 'passkey' | 'email' | 'google' | 'more';

interface LoginModalContentConfig {
    showGoogleLogin: boolean;
    showEmailLogin: boolean;
    showPasskey: boolean;
    showVeChainLogin: boolean;
    showDappKit: boolean;
    showEcosystem: boolean;
    showMoreLogin: boolean;
    isOfficialVeChainApp: boolean;
}

interface AccountModalContent {
    type: string;
    props?: Record<string, any>;
}
```

### Usage example

```typescript
// Example usage of Modal hooks
import { 
    useWalletModal,
    useAccountModal,
    useSendTokenModal,
    useTransactionModal,
    useLoginModalContent
} from '@modals';

const ExampleComponent = () => {
    // Wallet modal management
    const { 
        open: openWallet,
        close: closeWallet,
        isOpen: isWalletOpen 
    } = useWalletModal();

    // Account modal management
    const {
        open: openAccount,
        close: closeAccount,
        isOpen: isAccountOpen
    } = useAccountModal();

    // Send token modal
    const {
        open: openSendToken,
        close: closeSendToken,
        isOpen: isSendTokenOpen
    } = useSendTokenModal();

    // Transaction modal
    const {
        open: openTransaction,
        close: closeTransaction,
        isOpen: isTransactionOpen
    } = useTransactionModal();

    // Login modal content configuration
    const loginConfig = useLoginModalContent();

    // Example handlers
    const handleWalletClick = () => {
        openWallet();
    };

    const handleSendToken = () => {
        openSendToken();
    };

    const handleAccountSettings = () => {
        openAccount();
    };

    return (
        <div>
            <button 
                onClick={handleWalletClick}
                disabled={isWalletOpen}
            >
                Open Wallet
            </button>

            <button 
                onClick={handleSendToken}
                disabled={isSendTokenOpen}
            >
                Send Tokens
            </button>

            <button 
                onClick={handleAccountSettings}
                disabled={isAccountOpen}
            >
                Account Settings
            </button>

            {/* Login configuration display */}
            {loginConfig.showGoogleLogin && (
                <button>Login with Google</button>
            )}
            {loginConfig.showVeChainLogin && (
                <button>Login with VeChain</button>
            )}
            {loginConfig.showPasskey && (
                <button>Login with Passkey</button>
            )}

            {/* Transaction modal state */}
            {isTransactionOpen && (
                <div>Transaction in Progress...</div>
            )}
        </div>
    );
};

export default ExampleComponent;

/*
Note: These hooks require:
- ModalProvider context
- Valid wallet connection for some features
- Proper configuration for login methods
- Each modal manages its own state and content
*/
```
