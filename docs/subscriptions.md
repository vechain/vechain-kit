# Crypto Subscriptions

VeChain Kit subscriptions let users pay for recurring access (memberships, SaaS, premium features) with crypto. The first period is paid on-chain at checkout; renewals can be handled by your backend with fee-delegated transactions.

## How it works

1. **Checkout** — the user clicks a `SubscribeButton` (or `SubscriptionCheckoutModal` opens). The kit builds an on-chain clause that pays the first period:
   - ERC-20 plans: `transfer` of the period amount to the plan's `recipientAddress`.
   - VET plans: a VET transfer clause.
2. **Authorization** — after the transaction confirms, the kit builds an EIP-712 typed message (the `Subscribe` message) and signs it with the connected wallet (dapp-kit, Privy, or Privy cross-app connections are all supported via `useSignTypedData`).
3. **Activation** — the signed authorization is POSTed to your backend. The backend recovers the signer from the signature — **no Bearer token is stored** — validates the message against the plan registry, and activates the subscription.
4. **Renewals** — ERC-20 plans include a `maxPeriods` allowance cap: the user pre-authorizes up to `maxPeriods` pulls, so your backend keeper can `transferFrom` (fee-delegated) each period without further signatures. VET has no allowance mechanism, so VET renewals are manual.

## EIP-712 domain

The signed message uses this exact domain — your backend must verify against it:

```ts
{
    name: 'VeChainKit Subscription',
    version: '1',
    chainId: 100009, // main 100009, test 100010, solo 100011
}
```

Types: `Subscribe` (`planId`, `amount` in the token's smallest unit, `currency`, `interval`, `recipient`, `tokenAddress` — zero = VET, `maxPeriods`, `nonce`, `expiry`) and `SubscriptionAction` (`subscriptionId`, `action`, `nonce`, `expiry`). The authorization expires after 1 hour by default; the nonce prevents replays.

## Setup

Wrap your app with `VeChainKitProvider` and pass a `subscriptions` config:

```tsx
<VeChainKitProvider
    network={{ type: 'main' }}
    subscriptions={{
        apiBaseUrl: 'https://api.example.com',
        // optional: override how the EIP-712 message is signed
        signAuthorization: (data) => myCustomSigner(data),
    }}
>
```

No `apiBaseUrl`? Pass `plans` to run in standalone demo mode (subscriptions are stored locally, no backend).

## Defining plans

```ts
const plan: SubscriptionPlan = {
    id: 'pro-monthly',
    name: 'Pro',
    description: 'Pro membership',
    amount: '9.99', // fiat display amount
    currency: 'usd',
    interval: 'month',
    features: ['Early access', 'Priority support'],
    cryptoPayment: {
        recipientAddress: '0x...', // where payments go
        tokenAddress: '0x95761346d18244bb91664181bf91193376197088', // B3TR; omit or zero for VET
        amount: '100', // per period, in whole tokens
        maxPeriods: 12, // auto-pull cap; 0 = unlimited
    },
};
```

## UI

```tsx
<SubscribeButton plan={plan} onSuccess={() => refresh()} />
<SubscriptionCheckoutModal isOpen={isOpen} onClose={close} plan={plan} />
<SubscriptionModal isOpen={isOpen} onClose={close} /> // manage: pause/resume/cancel
```

## Backend reference

See `examples/next-template/server-reference/subscriptions.ts` for a framework-agnostic reference implementation (pure functions, works in Next.js route handlers, Express, Lambda, etc.):

- `createSubscription(store, planId, authorization)` — recovers the signer with `recoverTypedDataAddress` (viem), validates expiry, planId, recipient, token and amount against the plan registry, then activates. Always recompute the expected amount from the plan with `parseUnits(plan.cryptoPayment.amount, 18)` — never trust the message alone.
- `applySubscriptionAction(store, id, action, authorization)` — applies pause/resume/cancel; only the subscriber (recovered signer) can act.
- `verifyAuthorization(payload, now)` — shared domain/chain/expiry checks.

The endpoints map like so:

- `GET /subscriptions` — return `store.plans` (or the caller's subscription with `?address=`).
- `POST /subscriptions` — `{ planId, authorization: { domain, types, primaryType, message, signature } }` → `createSubscription`.
- `POST /subscriptions/:id/pause|resume|cancel` — signed `SubscriptionAction` messages → `applySubscriptionAction`.

## Renewal keeper

For ERC-20 plans, the allowance cap is `maxPeriods × period amount` (granted via `approve` on the token contract). Each renewal:

1. Check `allowance(subscriber, keeper) >= periodAmount` and the subscriber's balance.
2. `transferFrom(subscriber, recipientAddress, periodAmount)` — the transaction can be fee-delegated (VIP-191) so the user never pays gas.
3. Extend `currentPeriodEnd`. Respect `maxPeriods` and `cancelAtPeriodEnd`; do not pull for `paused` subscriptions.

Never auto-pull VET (zero `tokenAddress`) — there is no allowance mechanism.
