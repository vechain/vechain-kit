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

/**
 * A subscription plan offered by the host application.
 */
export type SubscriptionPlan = {
    id: string;
    name: string;
    description: string;
    /** Per-period fiat amount shown in the UI (e.g. "9.99"). */
    amount: string;
    currency: CURRENCY;
    interval: 'month' | 'year';
    features: string[];
    /**
     * On-chain payment parameters. When present, checkout pays with crypto.
     * - `tokenAddress` omitted or the zero address → paid in VET (manual per-period payment).
     * - `tokenAddress` set → paid in the ERC-20 token; the subscription
     *   authorizes a capped allowance so the backend keeper can auto-pull
     *   (fee-delegated `transferFrom`) each period.
     */
    cryptoPayment?: {
        recipientAddress: string;
        tokenAddress?: `0x${string}`;
        /** Per-period amount in whole tokens (e.g. "100" = 100 B3TR / 100 VET). */
        amount: string;
        /** Maximum number of periods the keeper may auto-pull. 0 = unlimited. */
        maxPeriods?: number;
        chainType?: 'main' | 'test' | 'solo';
    };
};

export type SubscriptionStatus =
    | 'active'
    | 'paused'
    | 'canceled'
    | 'past_due'
    | 'trialing';

export type UserSubscription = {
    id: string;
    planId: string;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
};

/**
 * EIP-712 authorization a user signs to subscribe. The backend recovers the
 * signer from this typed message (no Bearer token required) and verifies it
 * against the plan registry before activating the subscription.
 *
 * - `tokenAddress` zero (0x0000...0000) means VET — the backend must NOT
 *   auto-pull VET (there is no allowance mechanism), payments stay manual.
 * - `tokenAddress` set means ERC-20 — the kit grants a capped allowance and
 *   the backend keeper auto-pulls via fee-delegated `transferFrom`.
 */
export type SubscriptionAuthorizationMessage = {
    planId: string;
    /** Per-period amount in the token's smallest unit (uint256). */
    amount: string;
    currency: string;
    interval: 'month' | 'year';
    /** Address that receives the funds. */
    recipient: string;
    /** ERC-20 token address, or the zero address for VET. */
    tokenAddress: string;
    /** Maximum number of periods the keeper may auto-pull. 0 = unlimited. */
    maxPeriods: string;
    /** Unique nonce to prevent replay. */
    nonce: string;
    /** Unix timestamp after which the authorization is invalid. */
    expiry: string;
};

export type SubscriptionActionMessage = {
    subscriptionId: string;
    action: 'pause' | 'resume' | 'cancel';
    nonce: string;
    expiry: string;
};

/**
 * EIP-712 typed data passed to the wallet signer. Matches the shape accepted
 * by `useSignTypedData` (Privy `SignTypedDataParams` / VeChain `TypedDataDomain`).
 */
export type SubscriptionTypedData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
    };
    types: Record<string, { name: string; type: string }[]>;
    primaryType: string;
    message: SubscriptionAuthorizationMessage | SubscriptionActionMessage;
};

/**
 * Configures the subscription feature. Requires either an `apiBaseUrl`
 * (backend-backed subscriptions) or `plans` (standalone demo plans).
 */
export type SubscriptionsConfig = {
    apiBaseUrl?: string;
    /** Plans offered by the app. Used when no `apiBaseUrl` is set. */
    plans?: SubscriptionPlan[];
    /**
     * Override how the EIP-712 subscription authorization is signed. Defaults
     * to the connected wallet via the kit's `useSignTypedData` (supports
     * dapp-kit, Privy and Privy cross-app connections).
     */
    signAuthorization?: (data: SubscriptionTypedData) => Promise<string>;
};
