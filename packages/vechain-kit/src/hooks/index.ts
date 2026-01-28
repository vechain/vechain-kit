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
export {
    useThor,
    useWallet as useDAppKitWallet,
    useWalletModal as useDAppKitWalletModal,
} from '@vechain/dapp-kit-react';
export { ThorClient } from '@vechain/sdk-network';
export { useLegalDocuments } from '../providers/LegalDocumentsProvider';
