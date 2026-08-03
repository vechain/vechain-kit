import { parseUnits, recoverTypedDataAddress } from 'viem';
import type {
    SubscriptionPlan,
    UserSubscription,
} from '@vechain/vechain-kit';
import { SUBSCRIPTION_EIP712_DOMAIN } from '@vechain/vechain-kit/utils';

export type AuthorizationPayload = {
    domain: { name: string; version: string; chainId: number };
    types: Record<string, { name: string; type: string }[]>;
    primaryType: string;
    message: Record<string, string | number>;
    signature: `0x${string}`;
};

export type StoredSubscription = UserSubscription & {
    subscriber: string;
};

export type Store = {
    plans: SubscriptionPlan[];
    subscriptions: Map<string, StoredSubscription>;
};

export const createStore = (plans: SubscriptionPlan[]): Store => ({
    plans,
    subscriptions: new Map(),
});

export const isSupportedChainId = (chainId: number): boolean =>
    chainId === 100009 || chainId === 100010 || chainId === 100011;

/**
 * Recover and validate the signer of a subscription authorization. Throws on
 * invalid domain, unsupported chain or expired authorization.
 */
export const verifyAuthorization = async (
    payload: AuthorizationPayload,
    now = Date.now(),
): Promise<{ signer: string; message: Record<string, string | number> }> => {
    const { domain, types, primaryType, message, signature } = payload;

    if (
        domain.name !== SUBSCRIPTION_EIP712_DOMAIN.name ||
        domain.version !== SUBSCRIPTION_EIP712_DOMAIN.version
    ) {
        throw new Error('Invalid EIP-712 domain');
    }
    if (!isSupportedChainId(domain.chainId)) {
        throw new Error('Unsupported chain id');
    }
    if (Number(message.expiry) < Math.floor(now / 1000)) {
        throw new Error('Authorization expired');
    }

    const signer = await recoverTypedDataAddress({
        domain,
        types,
        primaryType,
        message,
        signature,
    });

    return { signer, message };
};

export const periodEnd = (
    interval: 'month' | 'year',
    start = Date.now(),
): string =>
    new Date(
        start + (interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000,
    ).toISOString();

export const expectedAmount = (plan: SubscriptionPlan): bigint =>
    parseUnits(plan.cryptoPayment?.amount ?? '0', 18);

export type CreateSubscriptionError =
    | 'UNKNOWN_PLAN'
    | 'PLAN_MISMATCH'
    | 'AUTHORIZATION_INVALID';

/**
 * Activates a subscription from a signed EIP-712 authorization. The amount,
 * recipient, token and interval in the signed message must match the plan
 * registry — always recompute the expected amount from the plan, never trust
 * the message alone.
 */
export const createSubscription = async (
    store: Store,
    planId: string,
    authorization: AuthorizationPayload,
    now = Date.now(),
): Promise<{ error: CreateSubscriptionError } | StoredSubscription> => {
    const plan = store.plans.find((p) => p.id === planId);
    if (!plan) {
        return { error: 'UNKNOWN_PLAN' };
    }

    try {
        const { signer, message } = await verifyAuthorization(
            authorization,
            now,
        );

        if (
            message.planId !== planId ||
            String(message.recipient).toLowerCase() !==
                plan.cryptoPayment?.recipientAddress.toLowerCase() ||
            String(message.tokenAddress).toLowerCase() !==
                (plan.cryptoPayment?.tokenAddress ?? '').toLowerCase() ||
            BigInt(message.amount) !== expectedAmount(plan) ||
            message.interval !== plan.interval
        ) {
            return { error: 'PLAN_MISMATCH' };
        }

        const subscription: StoredSubscription = {
            id: `sub_${Math.random().toString(36).slice(2, 12)}`,
            planId: plan.id,
            status: 'active',
            currentPeriodStart: new Date(now).toISOString(),
            currentPeriodEnd: periodEnd(plan.interval, now),
            cancelAtPeriodEnd: false,
            subscriber: signer,
        };

        store.subscriptions.set(subscription.id, subscription);
        return subscription;
    } catch {
        return { error: 'AUTHORIZATION_INVALID' };
    }
};

export type SubscriptionAction = 'pause' | 'resume' | 'cancel';

export type ApplyActionError =
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'ACTION_MISMATCH'
    | 'AUTHORIZATION_INVALID';

/**
 * Applies a pause/resume/cancel action to a subscription. The signer of the
 * `SubscriptionAction` message must be the subscription's subscriber.
 */
export const applySubscriptionAction = async (
    store: Store,
    subscriptionId: string,
    action: SubscriptionAction,
    authorization: AuthorizationPayload,
    now = Date.now(),
): Promise<{ error: ApplyActionError } | StoredSubscription> => {
    const subscription = store.subscriptions.get(subscriptionId);
    if (!subscription) {
        return { error: 'NOT_FOUND' };
    }

    if (
        authorization.primaryType !== 'SubscriptionAction' ||
        authorization.message.subscriptionId !== subscriptionId ||
        authorization.message.action !== action
    ) {
        return { error: 'ACTION_MISMATCH' };
    }

    try {
        const { signer } = await verifyAuthorization(authorization, now);
        if (signer !== subscription.subscriber) {
            return { error: 'UNAUTHORIZED' };
        }

        subscription.status =
            action === 'cancel'
                ? 'canceled'
                : action === 'pause'
                  ? 'paused'
                  : 'active';
        subscription.cancelAtPeriodEnd = action === 'cancel';
        return subscription;
    } catch {
        return { error: 'AUTHORIZATION_INVALID' };
    }
};
