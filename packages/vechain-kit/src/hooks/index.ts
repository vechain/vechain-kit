export * from './api';
export * from './modals';
export * from './notifications';
export * from './signing';
export * from './login';
export * from './utils';
export * from './cache';
export * from './generic-delegator';
export * from './thor';

// Re-export commonly used types and constants for better tree-shaking
export type { CURRENCY } from '../types/types';
export { CURRENCY_SYMBOLS } from '../types/types';
export {
    usePrivy,
    useMfaEnrollment,
    useSetWalletRecovery,
} from '@privy-io/react-auth';
// Re-export DAppKit hooks for backward compatibility
// These require DAppKitProvider to be configured
export {
    useThor,
    useWallet as useDAppKitWallet,
    useWalletModal as useDAppKitWalletModal,
} from '@vechain/dapp-kit-react';
export { ThorClient } from '@vechain/sdk-network';
export { useLegalDocuments } from '../providers/LegalDocumentsProvider';

// Re-export optional hooks that handle missing providers gracefully
export {
    useOptionalThor,
    useOptionalDAppKitWallet,
    useOptionalDAppKitWalletModal,
} from './api/dappkit';

export {
    useOptionalPrivyCrossAppSdk,
    useOptionalWagmiAccount,
} from './api/privy';
