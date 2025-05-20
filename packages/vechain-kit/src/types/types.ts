import { LoginMethodOrderOption } from '@privy-io/react-auth';
import { TransactionClause } from '@vechain/sdk-core';

export type TokenBalance = {
    original: string;
    scaled: string;
    formatted: string;
};

export type ENSRecords = {
    display?: string;
    description?: string;
    email?: string;
    url?: string;
    header?: string;
    notice?: string;
    location?: string;
    phone?: string;
    [key: string]: string | undefined;
};

export type Wallet = {
    address: string;
    domain?: string;
    image?: string;
    isLoadingMetadata?: boolean;
    metadata?: ENSRecords;
} | null;

export type SmartAccount = Wallet & {
    isDeployed: boolean;
    isActive: boolean;
    version: number | null;
};

export type ConnectionSource = {
    type: 'privy' | 'wallet' | 'privy-cross-app';
    displayName: string;
};

/**
 * Data that the Privy user must sign in order to execute a transaction
 * by authorizing the Smart Account contract
 */
export type ExecuteWithAuthorizationSignData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        ExecuteWithAuthorization: {
            name: string;
            type: string;
        }[];
        EIP712Domain: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    message: {
        validAfter: number;
        validBefore: number;
        to: string | null | undefined;
        value: string;
        data: string;
    };
};

export type ExecuteBatchWithAuthorizationSignData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        ExecuteBatchWithAuthorization: {
            name: string;
            type: string;
        }[];
        EIP712Domain: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    message: {
        to: string[] | null | undefined;
        value: string[] | null | undefined;
        data: string[] | null | undefined;
        validAfter: number;
        validBefore: number;
        nonce: string;
    };
};

/**
 * ready: the user has not clicked on the button yet
 * pending: the user has clicked on the button and we're waiting for the transaction to be sent
 * waitingConfirmation: the transaction has been sent and we're waiting for the transaction to be confirmed by the chain
 * success: the transaction has been confirmed by the chain
 * error: the transaction has failed
 * unknown: the transaction receipt has failed to load
 */
export type TransactionStatus =
    | 'ready'
    | 'pending'
    | 'waitingConfirmation'
    | 'success'
    | 'error'
    | 'unknown';

export type TransactionStatusErrorType = {
    type:
        | 'SendTransactionError'
        | 'TxReceiptError'
        | 'RevertReasonError'
        | 'UserRejectedError';
    reason?: string;
};

/**
 * An enhanced clause with a comment and an abi
 * @param comment a comment to add to the clause
 * @param abi the abi of the contract to call
 */
export type EnhancedClause = TransactionClause;

export type PrivyAppInfo = {
    id: string;
    name: string;
    logo_url: string;
    icon_url: string | null;
    terms_and_conditions_url: string;
    privacy_policy_url: string;
    theme: string;
    accent_color: string;
    wallet_auth: boolean;
    email_auth: boolean;
    google_oauth: boolean;
    twitter_oauth: boolean;
    url: string;
    website?: string;
};

export type PrivyLoginMethod = LoginMethodOrderOption;

export interface CrossAppConnectionCache {
    timestamp: number;
    ecosystemApp: {
        name: string;
        logoUrl?: string;
        appId: string;
        website?: string;
    };
}

export enum NFTMediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    UNKNOWN = 'unknown',
    TEXT = 'text', // mp4 appears as text sometimes
}

export enum VePassportUserStatus {
    NONE = 'NONE',
    WHITELIST = 'WHITELIST',
    BLACKLIST = 'BLACKLIST',
}

export type CURRENCY = 'usd' | 'gbp' | 'eur';

export const CURRENCY_SYMBOLS: Record<CURRENCY, string> = {
    usd: '$',
    gbp: '£',
    eur: '€',
};
