# Login modal

> Draft page for the [vechain-kit docs repo](https://docs.vechainkit.vechain.org/) — to be lifted into a separate PR.

VeChain Kit ships a fully owned connect modal. Clicking a wallet button drives `@vechain/dapp-kit` programmatically and renders **vechain-kit's own** "Waiting for signature…" view — no hand-off to dapp-kit's native modal. WalletConnect is the one exception: it still uses WalletConnect's own QR modal (triggered programmatically), because that modal _is_ the QR.

## Default layout

With Privy configured:

```
┌──────────────────────────────────────────────┐
│  (?)        Log in or sign up         (×)    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ [V]  Continue with VeWorld       •   │    │  ← primary, filled, recommended dot
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │ [G]  Continue with Google            │    │  ← outline secondary
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │ []   Continue with Apple             │    │  ← outline secondary
│  └──────────────────────────────────────┘    │
│                                              │
│              More options  ⌄                 │  ← link footer
└──────────────────────────────────────────────┘
```

Without Privy:

```
[ Continue with VeWorld ]
[ Continue with Google ]
[ Continue with Apple ]
[ Continue with Email ]
[ Sync2 ] [ WalletConnect ]
```

Social methods (Google, Apple, Email, X, Discord, GitHub, TikTok, LINE) work without a host-supplied `privy` prop too — the kit routes them through VeChain's whitelabel cross-app host. Only `passkey` and `more` still require Privy.

## Configuration

The grid is controlled by `loginMethods` on `<VeChainKitProvider>`. Each entry has a `method` and an optional `gridColumn` (1–4) that sets how many of the four columns the button occupies.

```tsx
<VeChainKitProvider
  privy={{
    appId: '...',
    clientId: '...',
    loginMethods: ['google', 'apple', 'email', 'twitter', 'discord'],
    appearance: { /* ... */ },
  }}
  dappKit={{
    allowedWallets: ['veworld', 'sync2', 'wallet-connect'],
    walletConnectOptions: { /* ... */ },
  }}
  loginMethods={[
    { method: 'veworld', gridColumn: 4 },
    { method: 'google',  gridColumn: 4 },
    { method: 'apple',   gridColumn: 4 },
    { method: 'more',    gridColumn: 4 },
  ]}
>
```

### Method values

| Method            | Requires          | What it does                                                                                  |
|-------------------|-------------------|-----------------------------------------------------------------------------------------------|
| `veworld`         | `dappKit.allowedWallets` includes `'veworld'` | Custom flow — opens the VeWorld extension / mobile in-app browser and shows the kit's "Waiting for signature…" view. |
| `sync2`           | `dappKit.allowedWallets` includes `'sync2'`   | Custom flow — drives Sync2 with the same waiting view.                                        |
| `wallet-connect`  | `dappKit.allowedWallets` includes `'wallet-connect'` + `walletConnectOptions.projectId` | Triggers WalletConnect's own QR modal programmatically. The kit's loading view sits behind. |
| `google`          | —                  | Google OAuth via host's Privy when `privy` is set, otherwise via VeChain's whitelabel cross-app host. |
| `apple`           | —                  | Apple OAuth via host's Privy when `privy` is set, otherwise via VeChain's whitelabel cross-app host.  |
| `github`          | —                  | GitHub OAuth via host's Privy when `privy` is set, otherwise via VeChain's whitelabel cross-app host. |
| `email`           | —                  | Inline email pill + 6-digit code modal with `privy` set; otherwise hands the email/OTP flow off to VeChain's whitelabel cross-app host. |
| `passkey`         | `privy`            | Privy WebAuthn flow. No cross-app fallback yet.                                              |
| `vechain`         | —                  | VeChain cross-app login (single wallet across Privy ecosystem apps).                         |
| `ecosystem`       | —                  | Renders a footer button that opens a sub-view listing x2earn ecosystem apps.                   |
| `more`            | —                  | Renders a "More options ⌄" link footer that opens an in-modal sub-view containing _every_ overflow option (other wallets, other Privy socials, ecosystem apps). |
| `dappkit`         | `dappKit`          | **Legacy.** Opens dapp-kit's native picker modal. Kept for backwards compatibility. Prefer the granular methods above. |

### `'more'` sub-view

When the user taps **More options ⌄**, the modal cross-fades into a sub-view that surfaces _overflow_ from your provider config:

- **Other wallets** — every entry in `dappKit.allowedWallets` not already on the main grid (VeWorld / Sync2 / WalletConnect).
- **Other sign-in** — every Privy method in `privy.loginMethods` we render natively (Google, Apple, GitHub, email, passkey). Anything else (Twitter, Discord, Farcaster, TikTok, LINE, …) is reachable via a fallback link.
- **Ecosystem apps** — the x2earn apps configured via Privy ecosystem.

Items already shown on the main grid are de-duplicated. Sections collapse when they would be empty.

## Theming

The modal honours `<VeChainKitProvider theme={...}>` for:

- **Modal surface / overlay / borders** — `theme.modal.backgroundColor`, `theme.modal.border`, `theme.modal.rounded`, `theme.overlay.backgroundColor`.
- **Text colors** — `theme.textColor` cascades to primary/secondary/tertiary text.
- **Primary button (VeWorld)** — `theme.buttons.primaryButton.{bg,color,border,rounded,hoverBg}`. The VeWorld CTA picks these up automatically.
- **Brand accent** — `theme.accent` controls the spinner top arc, focus rings, the "Waiting for signature…" headline color, and the email-submit link when the address is valid. Defaults to `#3b82f6` (light) / `#60a5fa` (dark).

```tsx
<VeChainKitProvider
  theme={{
    accent: '#ff6600',
    buttons: {
      primaryButton: {
        bg: '#0E0D18',
        color: '#FFFFFF',
        rounded: '16px',
      },
    },
  }}
>
```

### What stays brand-locked

Some surfaces intentionally _don't_ track theme overrides because they have to remain recognisable as brand-spec icons:

- Google's white tile + colored "G".
- Apple's logo (color flips with the modal text color for legibility).
- WalletConnect's `#3B99FC` tile.
- GitHub's `#24292e` tile.
- The recommended-provider green dot on VeWorld.

## Connect from your own UI

Two patterns:

```tsx
// 1. Open the modal from a custom button.
import { useConnectModal } from '@vechain/vechain-kit';
const { open, isOpen } = useConnectModal();
<button onClick={() => open()}>Sign in</button>;
```

```tsx
// 2. Drive a single wallet directly — no modal grid shown.
import { useConnectWithDappKitSource } from '@vechain/vechain-kit';
const { connect } = useConnectWithDappKitSource('veworld', setContent);
//                                              ^^^^^^^^
//   one of: 'veworld' | 'sync2' | 'wallet-connect'
```

Both flows show the same "Waiting for signature…" view and surface errors / rejections in the modal's error sub-view.

## Migration from `< 2.6.x`

- The default `loginMethods` changed. If you _didn't_ pass `loginMethods`, the modal previously rendered `[vechain, ecosystem, dappkit]` and now renders `[veworld, google, apple, more]` (Privy) or `[veworld, sync2, wallet-connect]` (no Privy).
- `google`, `apple`, and `email` no longer throw a "requires Privy configuration" error when listed in `loginMethods` without a `privy` prop. They route through VeChain's whitelabel cross-app host instead. `useLoginWithOAuth({ provider })` does the same routing for `google | apple | twitter | discord | github | tiktok | line`. To pre-select a provider via the cross-app flow, use `useLoginWithVeChain({ intent: 'google' })`.
- The legacy `'dappkit'` method is still supported and still opens dapp-kit's native modal — no breaking change for apps that pin it.
- The new granular methods (`'veworld'`, `'sync2'`, `'wallet-connect'`) honour `dappKit.allowedWallets` as a gate, so you can't accidentally render a wallet you didn't enable.
