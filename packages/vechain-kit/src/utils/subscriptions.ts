import { parseUnits } from 'viem';
import {
    SubscriptionActionMessage,
    SubscriptionAuthorizationMessage,
    SubscriptionPlan,
    SubscriptionTypedData,
} from '@/types';

/**
 * EIP-712 domain for subscription authorizations. The backend must verify the
 * signature against this exact domain (name, version, chainId).
 */
export const SUBSCRIPTION_EIP712_DOMAIN = {
    name: 'VeChainKit Subscription',
    version: '1',
} as const;

/** EIP-712 chain ids (EVM chain id) per VeChain network. */
const CHAIN_IDS: Record<'main' | 'test' | 'solo', number> = {
    main: 100009,
    test: 100010,
    solo: 100011,
};

export const SUBSCRIPTION_TYPES: Record<string, { name: string; type: string }[]> = {
    Subscribe: [
        { name: 'planId', type: 'string' },
        { name: 'amount', type: 'uint256' },
        { name: 'currency', type: 'string' },
        { name: 'interval', type: 'string' },
        { name: 'recipient', type: 'address' },
        { name: 'tokenAddress', type: 'address' },
        { name: 'maxPeriods', type: 'uint256' },
        { name: 'nonce', type: 'string' },
        { name: 'expiry', type: 'uint256' },
    ],
    SubscriptionAction: [
        { name: 'subscriptionId', type: 'string' },
        { name: 'action', type: 'string' },
        { name: 'nonce', type: 'string' },
        { name: 'expiry', type: 'uint256' },
    ],
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getSubscriptionChainId = (networkType: 'main' | 'test' | 'solo') =>
    CHAIN_IDS[networkType];

/** Generates a random uint256 nonce string for subscription authorizations. */
export const generateSubscriptionNonce = (): string =>
    BigInt(
        `0x${Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')}`,
    ).toString();

/** Default authorization validity window (Unix seconds). */
const DEFAULT_EXPIRY_SECONDS = 60 * 60; // 1 hour

export const getSubscriptionExpiry = (now = Date.now()): string =>
    Math.floor(now / 1000 + DEFAULT_EXPIRY_SECONDS).toString();

const normalizeTokenAddress = (tokenAddress?: `0x${string}`): string =>
    tokenAddress ?? ZERO_ADDRESS;

/**
 * Builds the EIP-712 `Subscribe` typed message for a plan. The `amount` and
 * `recipient` are taken from the plan's cryptoPayment; VET is represented by
 * the zero token address (backend must not auto-pull VET). The `amount` is
 * normalized to the token's smallest unit (uint256) assuming 18 decimals.
 */
export const buildSubscriptionAuthorization = (
    plan: SubscriptionPlan,
    networkType: 'main' | 'test' | 'solo',
    options?: { nonce?: string; expiry?: string; now?: number },
): SubscriptionTypedData => {
    const cryptoPayment = plan.cryptoPayment ?? {
        recipientAddress: '',
        amount: '0',
    };
    const maxPeriods = cryptoPayment.maxPeriods ?? 0;

    const message: SubscriptionAuthorizationMessage = {
        planId: plan.id,
        amount: parseUnits(cryptoPayment.amount, 18).toString(),
        currency: plan.currency,
        interval: plan.interval,
        recipient: cryptoPayment.recipientAddress,
        tokenAddress: normalizeTokenAddress(cryptoPayment.tokenAddress),
        maxPeriods: maxPeriods.toString(),
        nonce: options?.nonce ?? generateSubscriptionNonce(),
        expiry: options?.expiry ?? getSubscriptionExpiry(options?.now),
    };

    return {
        domain: {
            ...SUBSCRIPTION_EIP712_DOMAIN,
            chainId: getSubscriptionChainId(networkType),
        },
        types: SUBSCRIPTION_TYPES,
        primaryType: 'Subscribe',
        message,
    };
};

/**
 * Builds the EIP-712 `SubscriptionAction` typed message used to pause, resume
 * or cancel an existing subscription.
 */
export const buildSubscriptionAction = (
    subscriptionId: string,
    action: SubscriptionActionMessage['action'],
    networkType: 'main' | 'test' | 'solo',
    options?: { nonce?: string; expiry?: string; now?: number },
): SubscriptionTypedData => ({
    domain: {
        ...SUBSCRIPTION_EIP712_DOMAIN,
        chainId: getSubscriptionChainId(networkType),
    },
    types: SUBSCRIPTION_TYPES,
    primaryType: 'SubscriptionAction',
    message: {
        subscriptionId,
        action,
        nonce: options?.nonce ?? generateSubscriptionNonce(),
        expiry: options?.expiry ?? getSubscriptionExpiry(options?.now),
    },
});
