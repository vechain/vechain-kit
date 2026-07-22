# VeChain Kit — Project documentation

Product scope, installation, theming, login-modal behavior, versioning, and maintained examples.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `CONTRIBUTING.md`

# Contributor Guidelines

Thank you for considering contributing to our project! We welcome your contributions and value the community's input. To
ensure a smooth collaboration, please follow these guidelines:

## Submitting a Bug Report

-   Search the [issue tracker](https://github.com/vechain/vechain-dapp-kit/issues) to ensure that the bug has
    not been reported already.
-   If the bug has not been reported, create a new issue with a descriptive title and a clear description of the bug.

## Getting Started

-   Fork the repository and clone it to your local machine.
-   Install the necessary dependencies.

## Making Changes

-   Create a new branch for your changes.
-   Make your changes and test them thoroughly.
-   Follow the coding style and conventions used in the project (prettier, eslint).

## Submitting Changes

-   Commit your changes with clear and concise messages.
-   Push your changes to your fork.
-   Create a pull request with a detailed description of your changes.

## Reporting Issues

If you encounter any issues or have suggestions,
please [open an issue](https://github.com/vechain/vechain-dapp-kit/issues) on GitHub.

## Source: `README.md`

![Zizmor Checks](https://github.com/vechain/vechain-kit/actions/workflows/scan-workflows.yaml/badge.svg?branch=main&event=push)

#### An all-in-one library for building VeChain applications.

<div align="center">
    <img src="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png" alt="VeChain Kit Banner">
</div>

## Introduction

VeChain Kit is a comprehensive library designed to make building VeChain applications fast and straightforward.

It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, VeChain Embedded Wallet, and social logins (Google, Apple, GitHub, X/Twitter, Discord, TikTok, LINE, email, passkey — powered by Privy).
-   <b>Custom Connection UI:</b> Vechain-kit's own connect modal handles the VeWorld and Sync2 flows directly, with a built-in “Waiting for signature…” view and a fully themeable layout. WalletConnect's QR modal is preserved.
-   <b>Social Logins Without Your Own Privy Account:</b> Drop a "Continue with Google / Apple / X / Discord / GitHub / TikTok / LINE" button in your app and it just works — the kit routes through VeChain's whitelabel cross-app host (`cross-app-connect/`) so users get one VeChain identity that follows them across every kit-using dApp. No Privy bill, no dashboard setup.
-   <b>Unified Ecosystem Accounts:</b> Leverage Privy’s Ecosystem feature to give users a single wallet across multiple dApps, providing a consistent identity within the VeChain network.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.
-   <b>Multi-Language Support:</b> Built-in i18n for a global audience.
-   <b>Token Operations:</b> Send tokens, check balances, manage VET domains, and more—all in one place.

> **Note**: Currently supports React and Next.js only

📚 For detailed documentation, visit our [VeChain Kit Docs](https://docs.vechainkit.vechain.org/)

## Demo & Examples

-   [Homepage](https://vechainkit.vechain.org/)
-   [VeKit Playground](https://playground.vechainkit.vechain.org/) — interactive playground with live demos, code snippets and ready-made AI prompts for every kit feature
-   [Sample Next.js App](https://github.com/vechain/vechain-kit/tree/main/examples/next-template)
-   [Smart Account Factory](https://vechain.github.io/smart-accounts/)
-   [Docs](https://docs.vechainkit.vechain.org/)

## Cross-app Whitelabel Host

When a user picks "Continue with Google / Apple / VeChain / …" from a kit-using dApp, the kit opens a small popup that handles the OAuth/SMS handshake and posts the resulting signature back. That popup runs on VeChain's whitelabel host, which lives in this repo at [`cross-app-connect/`](./cross-app-connect/) — a Next.js static export with VeChain branding, a calldata-aware transaction summary, recovery from stale connection records, and 17 languages.

The whitelabel popup is why your app can offer social login without owning a Privy account: users see VeChain chrome and get one identity across every kit-integrated dApp.

See [`cross-app-connect/README.md`](./cross-app-connect/README.md) for the popup's architecture, the rationale behind dropping Chakra / TanStack Query / vechain-kit from that surface, deploy instructions (GitHub Pages workflow included), and how to add translation keys.

## Infrastructure

The hosted properties of VeChain Kit live across three repos:

-   **[vechain/vechain-kit-infra](https://github.com/vechain/vechain-kit-infra)** — Terraform that provisions S3 + CloudFront + ACM + Route53 for `vechainkit.vechain.org`, `kit.vechain.org`, `preview.vechainkit.vechain.org`, and `playground.vechainkit.vechain.org`. Owns the `vechainkit.vechain.org` Route53 zone.
-   **[vechain/vechain.org-domains](https://github.com/vechain/vechain.org-domains)** — Terraform-managed DNS records for the `vechain.org` zone. Holds the NS delegation that points `vechainkit.vechain.org` at the AWS nameservers managed by `vechain-kit-infra`.
-   **This repo's `.github/workflows/`** — `deploy-cloudfront.yaml` (homepage on push to main), `deploy-preview.yaml` (per-PR homepage previews), `deploy-playground-cloudfront.yaml` (playground on push to main), `deploy-playground-preview.yaml` (per-PR playground previews at `preview.vechainkit.vechain.org/<branch>/playground`).

Deploys are triggered by GitHub Actions; the infrastructure (S3 buckets, CloudFront distributions, IAM role for OIDC) is provisioned out-of-band by `terraform apply` against `vechain-kit-infra/terraform/frontend`.

## Table of Contents

-   [Setting up for local development](#setting-up-for-local-development)
-   [Branching Strategy](#branching-strategy)
-   [E2E Testing](#e2e-testing)
-   [Publishing](#publishing)

# Setting up for local development

### Prerequisites

-   Node.js >= 20.10.0
-   Yarn >= 1.22.10

You will need to have 3 terminals open:

1. In terminal 1, run the command to install all dependencies, both in the `vechain-kit` and `examples` folders. Run this command every time you add dependencies to the project.

```bash
yarn install:all
```

2. In terminal 2, enter in 'packages/vechain-kit' and run the command to keep your build in sync with the code you are developing.

```bash
yarn watch
```

3. In terminal 3, enter in 'examples/sample-next-privy-app' and run the command to start the NextJS app.

```bash
yarn dev
```

## Branching Strategy

Welcome to our project! Here's an overview of our branching strategy.

### Branch Types

-   **main**: The main branch represents the production-ready code. Only stable and tested features should be merged into
    this branch. Once ready for publishing, a new tag should be created from this branch.

## E2E Testing

We utilize Playwright for end-to-end (E2E) testing. To conduct these tests, you'll need to install browsers first:

```bash
cd tests/e2e
yarn install-browsers
```

Once installed, you can run tests in the browser using:

```bash
yarn test
```

Alternatively, you can run them in headed mode (the opposite of headless):

```bash
yarn test:headed
```

Once the tests are done, run this to open the report:

```bash
yarn report
```

## Translating

```bash
cd packages/vechain-kit
yarn translate
```

This will complete all the missing translations in the `en.json` file.
In order to translate the file, you will need to create a `.env` inside the `packages/vechain-kit` folder with the `OPENAI_API_KEY` set to your OpenAI API key.

## Publishing

1. Prepare the release, this will check out the release branch, install dependencies, build packages, test and update the package versions

```bash
yarn prepare:release X.Y.Z
```

This will create a release branch called `vX.Y.Z` and update the package versions in the `package.json` files.

2. Create the PR for the release branch `vX.Y.Z`.

3. When the PR is merged, create the release on github called `X.Y.Z`, it will automatically tag the commit with the version `X.Y.Z`.

4. Publish the release

```bash
yarn publish:release X.Y.Z
```

## Source: `VERSIONING.md`



## Source: `cross-app-connect/README.md`

# cross-app-connect

VeChain's whitelabel host for Privy's cross-app connect & transact flows.

This is the page that opens in the popup when a user signs into a VeChain
dapp (or signs a transaction) using their VeChain identity. The popup runs
on this origin, talks to Privy's backend, and posts the result back to the
requesting dapp via `postMessage`. Users see VeChain branding throughout
instead of Privy's default chrome.

## What this is

When a dapp uses `@vechain/vechain-kit` and a user chooses "Continue with
VeChain", the kit opens a small popup window. Two routes handle the two
phases of the flow:

- **`/cross-app/connect`** — first-time and returning login. Resolves the
  user's identity (Google/Apple/Phone/etc. via Privy), shows the requesting
  dapp's metadata, and on confirm posts a `PRIVY_CROSS_APP_CONNECT_RESPONSE`
  back to the opener with the user's address.
- **`/cross-app/transact`** — signing surface. Decrypts the incoming
  request, decodes it into a plain-language summary, and lets the user
  approve a signature. On confirm, posts a `PRIVY_CROSS_APP_ACTION_RESPONSE`
  back to the opener with the signed payload.

The shell is a plain Next.js 16 app exported as static HTML/JS. No server
runtime is needed in production — deploy the `dist/` folder anywhere that
serves static files.

## Why a separate whitelabel host

Privy's hosted cross-app pages are functional but generic. A VeChain user
landing on a Privy-branded popup mid-flow is jarring and weakens the
identity story. Owning this surface means:

- **VeChain branding end-to-end** — logo, colors, copy, dark/light theme
  consistent with the kit.
- **Plain-language transaction review** — a VeChain-aware decoder turns
  raw calldata into "Send 10 B3TR to vechain.vet", flags unverified
  contracts, recognizes governance votes and DEX swaps, and surfaces
  unlimited approvals.
- **17 languages** matching the kit (en, de, it, fr, es, zh, ja, ru, ro,
  vi, nl, ko, sv, tw, tr, hi, pt) detected from `navigator.language`.
- **Better recovery paths** — when a connection record is stale, the
  popup explains the problem in plain language and notifies the kit to
  log the user out and reopen the login modal in one tap, instead of
  leaving them stuck.

## Features

- **Verified-contract recognition.** Calls against VeChain-maintained
  contracts (B3TR, VOT3, governor, treasury, X2Earn pools, etc.) render
  with a labelled chip and a green check. Unknown contracts surface an
  "Unverified contract" warning.
- **Known-action decoder.** Hand-written detectors for ERC-20 transfer,
  ERC-20 approve (with unlimited-allowance highlighting), VeChain
  domain operations, VeBetterDAO governance (vote / endorse / allocate),
  voter & allocation rewards, B3TR↔VOT3 conversion, NFT transfers and
  manage-all approvals, and DEX swaps via BetterSwap / VeTrade.
- **App Hub lookup.** The requester's origin is matched against a
  cached `vechain/app-hub` manifest so the popup can show
  `Confirm token swap on Nubila` instead of a raw URL. Regenerate via
  `yarn generate-app-hub`.
- **Stale-connection recovery.** When the popup can't decrypt the
  incoming request (TTL expired, account mismatch, first-time visitor),
  it shows a clear "Reconnection needed" screen and posts a
  `PRIVY_CROSS_APP_ACTION_ERROR` with a `vk:cross-app-no-connection`
  marker on close. The kit catches the marker, logs the user out, and
  reopens its connect modal automatically.
- **Headless login.** Drives Privy's `useLoginWithOAuth` and
  `useLoginWithSms` hooks behind a custom picker. The user never sees
  Privy's modal — even on session expiry inside the transact route.
- **Recent provider hint.** Stores the last-used OAuth provider and the
  last identity locally so the picker can pre-highlight it and the
  transact "session expired" screen can greet the user by name.

## Why no Chakra, TanStack Query, or vechain-kit

This started as a kit-consuming page, then we pulled those out. Reasons:

- **Bundle weight.** The popup loads in a small window for a single
  decision. Chakra ships ~100KB of runtime and theme; TanStack Query
  adds ~12KB; vechain-kit pulls in dapp-kit, wagmi, viem, smart-account
  hooks, modal stacks, and a lot more. Total round-trip on the previous
  setup was multi-MB. CSS Modules + CSS variables + a single Privy SDK
  call gets the same surface in a fraction of the size.
- **First-paint latency.** The popup is a critical path — every second
  the user waits is a second their flow feels broken. Static export
  with no client-side data layer means HTML is ready immediately and
  the only network calls are the Privy auth handshake and (optionally)
  a Thor `getAccount` for the contract resolver.
- **No data-fetching layer needed.** This surface has exactly two
  network reads (smart account address, chain ID) and posts results
  back via `postMessage`. TanStack Query's caching/invalidation
  machinery solves problems we don't have here. Plain `fetch` + a tiny
  in-memory cache is enough.
- **Direct SDK gives us the right primitives.** `@vechain/sdk-core` and
  `@vechain/sdk-network` are kept — we still need to decode calldata,
  derive smart-account addresses, and compute chain IDs. We just don't
  need them wrapped in a React abstraction layer.
- **No theming framework to fight.** Light/dark and the VeChain palette
  are CSS variables on `:root` and `[data-color-mode='dark']`. A
  pre-paint inline script sets the attribute before React mounts, so
  there's zero flash. No `ChakraProvider`, no emotion runtime, no
  prop-shape API on every primitive.
- **Independent release cadence.** vechain-kit ships a flow that
  expects to *open* this popup. If both lived in the same package, a
  routine kit release would force a popup redeploy and vice versa.
  Keeping them separate lets the popup move independently — and lets a
  consuming app run a known-good kit version against a freshly fixed
  popup deployment.

What stayed: **React** (UI tree), **i18next** (translations — kit-aligned
keys), **`react-icons/lu`** (Lucide subset, tree-shaken), **Privy SDKs**
(non-negotiable — the actual flow), and the **VeChain SDKs**.

## Local development

```bash
# from repo root
yarn install:all
yarn dev:cross-app-connect   # kit watch + Next.js dev on :3001
```

Environment variables (`.env.local`):

```
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
NEXT_PUBLIC_PRIVY_DOMAIN=https://privy.your-app.privy.dev
```

To test the popup against a kit-using dapp running locally, point your
Privy dashboard's redirect URL at `http://localhost:3001` (or use a
trycloudflare tunnel — `next.config.js` allows `*.trycloudflare.com` as a
dev origin).

## Build & deploy

```bash
yarn workspace cross-app-connect build
```

Outputs a fully static site to `cross-app-connect/dist/`. Upload to any
static host (Cloudflare Pages, S3, Vercel static, …). Set the Privy
dashboard's allowed origins to match.

## Adding a translation key

1. Add the key + English value to `src/app/i18n/locales/en.json`.
2. Add the translated value to each of the 16 sibling locale files.
3. Reference it via `useTranslation()` → `t('your.key')`.

## Regenerating the App Hub cache

```bash
yarn workspace cross-app-connect generate-app-hub
```

Pulls every `manifest.json` under
[`vechain/app-hub`](https://github.com/vechain/app-hub) and writes a
single keyed-by-origin lookup to `src/app/cross-app/_lib/app-hub.json`.
Re-run whenever a new app is added to the registry.

## Source: `docs/login-modal.md`

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

## Source: `examples/next-chakra-v3/README.md`

# next-chakra-v3

Minimal repro of b3tr's frontend stack for debugging vechain-kit theming and
color-mode propagation **without publishing new kit versions**.

What this mirrors from b3tr:

- Next.js (App Router) + React 18 — the monorepo's root `resolutions`
  field pins `next` to 15.5.9, so this example uses 15.5.9 instead of
  b3tr's 16.2.x. The bug we're chasing is in the kit / Chakra-v3 host
  interaction, not in Next itself, so this doesn't affect reproducibility.
- Chakra UI v3 with `cssVarsPrefix: "vbd"` and semantic tokens that have
  `_dark` variants
- next-themes (`attribute="class"`) driving the color mode
- A `useColorMode` wrapper that reads `resolvedTheme` from `useTheme()`
- A `VechainKitProviderWrapper` that pipes `useToken('colors', [...])`
  results — which Chakra v3 returns as CSS variable references like
  `var(--vbd-colors-bg-primary)` — straight into the kit's `theme` prop and
  passes `darkMode={colorMode === 'dark'}`

The kit is workspace-linked (`workspace:*`), so any change in
`packages/vechain-kit/src` flows through after a `yarn watch` rebuild.

## Run

```bash
# from repo root
yarn install:all   # only the first time, or after pulling dep changes
yarn dev:next-chakra-v3
```

The example serves on http://localhost:3001. Click the sun/moon icon to
toggle `next-themes`; open the connect modal to inspect kit theme
propagation.

## Source: `examples/next-template/README.md`

# `vechain-kit-homepage`

This example demonstrates how to integrate the `@vechain/vechain-kit` package into a Next.js application. It showcases how to leverage the library for VeChain ecosystem integration, providing a foundation for building robust and user-friendly decentralized applications (dApps).

## Setup

```bash
yarn
```

## Run

```bash
yarn dev
```

## Source: `examples/playground/README.md`

# `vechain-kit-old-homepage`

This is the homepage of VeChain Kit, a library for building dApps on the VeChainThor blockchain.

## Setup

```bash
yarn
```

## Run

```bash
yarn dev
```

## Source: `packages/vechain-kit/README.md`

An all-in-one SDK for building frontend applications on VeChain, supporting wallet integration, developer hooks, pre-built UI components, and more.

<div align="center">
    <img src="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png" alt="VeChain Kit Banner">
</div>

## What's inside

-   **Seamless Wallet Integration:** VeWorld, Sync2, WalletConnect, and social logins (Google, Apple, GitHub, X/Twitter, Discord, TikTok, LINE, email, passkey via Privy).
-   **Custom Connection UI:** A themeable connect modal owns the VeWorld and Sync2 flows end-to-end. WalletConnect's QR modal is preserved.
-   **Developer-Friendly Hooks:** Easy-to-use React Hooks that let you read and write data on VeChainThor.
-   **Pre-Built UI Components:** TransactionModal, ProfileModal, SendTokenModal — drop them in and go.
-   **Token Operations:** Send, swap, check balances, manage VET domains.

> **Note:** Currently supports React and Next.js only.

## Start with AI (recommended)

The fastest path is to hand a prompt to your coding agent (Claude Code, Cursor, or any agent). The prompts below tell the agent to read the relevant [VeChain AI Skill](https://github.com/vechain/vechain-ai-skills) first so it follows current conventions.

### 🚀 Start a new VeChain dApp

```text
Before doing anything, read these VeChain AI Skills so you follow current conventions:
- create-vechain-dapp: https://github.com/vechain/vechain-ai-skills/tree/main/skills/create-vechain-dapp
- vechain-kit: https://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit

Now the task:

Scaffold a new VeChain dApp for me using create-vechain-dapp, with:
- VeChain Kit pre-wired (Privy social login: Google + email, plus VeWorld and WalletConnect)
- Chakra UI v3 (with next-themes) and dark mode by default — follow the next-chakra-v3 example in the vechain-kit repo for wiring the kit's `theme` prop via `useChakraContext().token.var(...)` so theme tokens stay reactive
- A landing page that shows the connected user's address, B3TR balance, and a "Send B3TR" button
- A GitHub Pages deploy workflow ready to use

Name the project "my-vechain-dapp". When done, run `yarn dev` and tell me the URL.
```

### Or: add VeChain Kit to an existing project

```text
Before doing anything, read this VeChain AI Skill so you follow current conventions:
- vechain-kit: https://github.com/vechain/vechain-ai-skills/tree/main/skills/vechain-kit

Now the task:

I already have a Next.js app and I want to add VeChain Kit to it.

1. Install @vechain/vechain-kit and any required peer deps.
2. Find my root layout (app/layout.tsx for App Router or pages/_app.tsx for Pages Router) and wrap it with VeChainKitProvider.
3. Enable Privy social login (Google + email), VeWorld and WalletConnect.
4. Read Privy keys from NEXT_PUBLIC_PRIVY_* and the WalletConnect projectId from NEXT_PUBLIC_WC_PROJECT_ID.
5. Add a <WalletButton /> to my existing header.
6. Don't change my existing Chakra theme.

If you hit peer-dependency conflicts, stop and tell me before applying any fix.
```

### Why this works

[VeChain AI Skills](https://github.com/vechain/vechain-ai-skills) give your coding agent up-to-date domain knowledge (wallet UX, smart contracts, VeBetterDAO, StarGate, and more). Install once:

```bash
npx skills add vechain/vechain-ai-skills
```

Or in Claude Code:

```text
/plugin marketplace add vechain/vechain-ai-skills
```

Browse all 11 skills and try each in context: <https://playground.vechainkit.vechain.org/ai-skills>.

## Manual install

Prefer to wire it yourself?

```bash
yarn add @vechain/vechain-kit \
  @chakra-ui/react@^2.8.2 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0 \
  @tanstack/react-query@^5.64.2 \
  @vechain/dapp-kit-react@2.1.0-rc.1 \
  framer-motion@^11.15.0
```

Wrap your app with the provider:

```tsx
'use client';

import { VeChainKitProvider } from '@vechain/vechain-kit';

export function Providers({ children }: { children: React.ReactNode }) {
    return <VeChainKitProvider>{children}</VeChainKitProvider>;
}
```

Add a wallet button anywhere:

```tsx
'use client';

import { WalletButton } from '@vechain/vechain-kit';

export function Page() {
    return <WalletButton />;
}
```

That's it — your app is ready to connect to VeChain mainnet with VeWorld.

#### Customize the login modal

The connect modal renders a grid of login methods. Reorder, hide, or swap them via `loginMethods` on the provider:

```tsx
<VeChainKitProvider
    privy={{
        appId: '...',
        clientId: '...',
        loginMethods: ['google', 'apple', 'email'],
        appearance: { /* ... */ },
    }}
    dappKit={{
        allowedWallets: ['veworld', 'sync2', 'wallet-connect'],
        walletConnectOptions: { /* ... */ },
    }}
    loginMethods={[
        { method: 'veworld', gridColumn: 4 }, // primary CTA (filled, recommended)
        { method: 'google',  gridColumn: 4 },
        { method: 'apple',   gridColumn: 4 },
        { method: 'more',    gridColumn: 4 }, // opens an in-modal sub-view
    ]}
    theme={{ accent: '#3b82f6' }}
>
```

Available `method` values: `veworld`, `sync2`, `wallet-connect`, `google`, `apple`, `github`, `email`, `passkey`, `vechain` (cross-app), `ecosystem`, `more`, and the legacy `dappkit`.

For full configuration options see the [documentation](https://docs.vechainkit.vechain.org/) or try every feature live in the [playground](https://playground.vechainkit.vechain.org/).

## Resources

-   [VeKit Playground](https://playground.vechainkit.vechain.org/) — interactive demos + code + AI prompts for every kit feature
-   [Homepage](https://vechainkit.vechain.org/)
-   [Documentation](https://docs.vechainkit.vechain.org/)
-   [VeChain AI Skills](https://github.com/vechain/vechain-ai-skills)

## Troubleshooting

-   [Troubleshooting docs](https://docs.vechainkit.vechain.org/vechain-kit/troubleshooting)
-   [Discord](https://discord.gg/wGkQnPpRVq)
-   [Open an issue on GitHub](https://github.com/vechain/vechain-kit/issues)

## Source: `packages/vechain-kit/THEME_CUSTOMIZATION.md`

# Theme Customization Guide

This guide explains how to customize the VeChain Kit theme to match your app's design.

## Quick Start

The theme system is designed to be simple - you only need to provide a base `modal.backgroundColor` and `textColor`, and all other colors are automatically derived. You can optionally customize specific aspects like overlay, buttons, and glass effects.

```tsx
<VeChainKitProvider
    theme={{
        modal: {
            backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
        },
        textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            blur: 'blur(3px)',
        },
        buttons: {
            secondaryButton: {
                bg: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: 'none',
            },
        },
        effects: {
            glass: {
                enabled: true,
                intensity: 'low',
            },
        },
    }}
    // ... other props
>
    {children}
</VeChainKitProvider>
```

## Simplified API

The theme configuration has been simplified to focus on what matters most:

### Base Colors

-   **`modal.backgroundColor`** (optional) - Base background color for the modal. Automatically derives:

    -   Modal background (100% opacity)
    -   Card background (80% opacity)
    -   Sticky header background (90% opacity)
    -   Secondary/tertiary colors (with opacity overlays)
    -   Border colors

-   **`textColor`** (optional) - Base text color. Automatically derives:
    -   Primary text (100% opacity)
    -   Secondary text (70% opacity)
    -   Tertiary text (50% opacity)

### Overlay Configuration

Customize the modal overlay independently:

```tsx
overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay background color
    blur: 'blur(10px)', // Overlay blur effect
}
```

### Button Customization

Customize button styles for different button variants. All button configs are grouped under the `buttons` object:

**Secondary Buttons** (applies to all `vechainKitSecondary` buttons):

```tsx
buttons: {
    secondaryButton: {
        bg: 'rgba(255, 255, 255, 0.1)', // Background color
        color: '#ffffff', // Text color
        border: '1px solid rgba(255, 255, 255, 0.2)', // Border (full CSS string)
    },
}
```

**Primary Buttons** (applies to all `vechainKitPrimary` buttons):

```tsx
buttons: {
    primaryButton: {
        bg: '#3182CE', // Background color
        color: '#ffffff', // Text color
        border: 'none', // Border (full CSS string)
    },
}
```

**Tertiary Buttons** (applies to all `vechainKitTertiary` buttons):

```tsx
buttons: {
    tertiaryButton: {
        bg: 'transparent', // Background color
        color: '#ffffff', // Text color
        border: 'none', // Border (full CSS string)
    },
}
```

**Login Buttons** (applies to `loginIn` variant):

```tsx
buttons: {
    loginButton: {
        bg: 'transparent', // Background color
        color: '#ffffff', // Text color
        border: '1px solid rgba(255, 255, 255, 0.1)', // Border (full CSS string)
    },
}
```

You can customize multiple button types in one config:

```tsx
buttons: {
    secondaryButton: {
        bg: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        border: 'none',
    },
    primaryButton: {
        bg: '#3182CE',
        color: '#ffffff',
        border: 'none',
    },
    loginButton: {
        bg: 'transparent',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
}
```

Hover and active states are handled automatically through opacity for all button types.

### Font Customization

Customize fonts used throughout VeChain Kit components:

```tsx
fonts: {
    family: 'Inter, sans-serif', // Font family (e.g., "Inter, sans-serif", "'Roboto', sans-serif")
    sizes: {
        small: '12px', // Font size for small text
        medium: '14px', // Font size for medium text
        large: '16px', // Font size for large text
    },
    weights: {
        normal: 400, // Normal font weight
        medium: 500, // Medium font weight
        bold: 700, // Bold font weight
    },
}
```

**Important**: Font customization only affects VeChain Kit components (modals, buttons, etc.) and does not leak to your host application. Fonts are scoped to VeChain Kit containers only.

You can customize any subset of font properties - unspecified values will use defaults:

```tsx
// Only customize font family
fonts: {
    family: 'Inter, sans-serif',
}

// Only customize font sizes
fonts: {
    sizes: {
        medium: '15px',
        large: '18px',
    },
}
```

### Glass Effects

Enable and configure glass morphism effects:

```tsx
effects: {
    glass: {
        enabled: true, // Enable glass effects
        intensity: 'low' | 'medium' | 'high', // Glass intensity
    },
    backdropFilter: {
        modal: 'blur(15px)', // Optional: override modal blur
        // overlay blur is set via overlay.blur
    },
}
```

When glass is enabled, the system automatically:

-   Applies appropriate blur values based on intensity
-   Adjusts background opacities for glass morphism effect
-   Maintains readability across all surfaces

**Glass Intensity Settings:**

-   `low`: `blur(2px)`, modal opacity 0.6, sticky header opacity 0.7
-   `medium`: `blur(3px)`, modal opacity 0.7, sticky header opacity 0.8
-   `high`: `blur(5px)`, modal opacity 0.8, sticky header opacity 0.85

## Complete Example

Here's a complete example with glass effects:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const theme: VechainKitThemeConfig = {
    modal: {
        backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
    },
    textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
    overlay: {
        backgroundColor: isDarkMode
            ? 'rgba(0, 0, 0, 0.6)'
            : 'rgba(0, 0, 0, 0.4)',
        blur: 'blur(3px)',
    },
    buttons: {
        secondaryButton: {
            bg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
            border: 'none',
        },
        primaryButton: {
            bg: isDarkMode ? '#3182CE' : '#2B6CB0',
            color: 'white',
            border: 'none',
        },
        loginButton: {
            bg: 'transparent',
            color: isDarkMode ? 'white' : '#1a1a1a',
            border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid #ebebeb',
        },
    },
    fonts: {
        family: 'Inter, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    effects: {
        glass: {
            enabled: true,
            intensity: 'low',
        },
    },
};

<VeChainKitProvider theme={theme} {...otherProps}>
    {children}
</VeChainKitProvider>;
```

## How It Works

1. **Simplified Input**: You provide only `modal.backgroundColor` and `textColor`
2. **Automatic Derivation**: The system derives all other colors (secondary, tertiary, borders) with appropriate opacity
3. **Token System**: Your config is converted to internal `ThemeTokens`
4. **Semantic Tokens**: Tokens are exposed as Chakra semantic tokens (e.g., `vechain-kit-modal`)
5. **Component Usage**: Components use `useToken()` to access semantic tokens
6. **CSS Variables**: DAppKit and Privy CSS variables are generated from tokens
7. **Automatic Sync**: All modals (VeChain Kit, DAppKit, Privy) derive from the same tokens

## Color Derivation

When you provide `modal.backgroundColor`:

-   **Modal**: Uses `modal.backgroundColor` at 100% opacity
-   **Card**: Uses `modal.backgroundColor` at 80% opacity
-   **Sticky Header**: Uses `modal.backgroundColor` at 90% opacity
-   **Secondary Colors**: Derived from white (dark mode) or black (light mode) overlays with opacity
-   **Borders**: Derived from white (dark mode) or black (light mode) overlays with low opacity

When you provide `textColor`:

-   **Primary Text**: Uses `textColor` at 100% opacity
-   **Secondary Text**: Uses `textColor` at 70% opacity
-   **Tertiary Text**: Uses `textColor` at 50% opacity

## Glass Effects

When glass effects are enabled:

-   Background colors automatically get reduced opacity based on intensity
-   Blur values are applied to modal, overlay, and sticky header
-   The system ensures readability while maintaining the glass aesthetic

If glass is disabled, default blur values are still applied (not removed).

## Partial Configuration

You only need to specify the values you want to customize. All other values will use sensible defaults:

```tsx
// Minimal config - just enable glass effects
theme={{
    effects: {
        glass: {
            enabled: true,
            intensity: 'medium',
        },
    },
}}

// Customize overlay only
theme={{
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        blur: 'blur(5px)',
    },
}}

// Customize secondary buttons only
theme={{
    buttons: {
        secondaryButton: {
            bg: '#6366f1',
            color: '#ffffff',
            border: 'none',
        },
    },
}}

// Customize primary buttons only
theme={{
    buttons: {
        primaryButton: {
            bg: '#3182CE',
            color: '#ffffff',
            border: 'none',
        },
    },
}}

// Customize fonts only
theme={{
    fonts: {
        family: 'Inter, sans-serif',
    },
}}
```

## TypeScript Support

Import the type for full autocomplete:

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const myTheme: VechainKitThemeConfig = {
    modal: {
        backgroundColor: '#ffffff',
    },
    textColor: '#2e2e2e',
    // ... your config
};
```

## Conditional Styling

The sticky header automatically becomes transparent when there's no content below it, and applies the configured background + blur when content is detected. This is handled automatically by `StickyHeaderContainer`.

## Default Behavior

If you don't provide a theme config, the system uses default colors:

-   **Light Mode**: White backgrounds, dark text
-   **Dark Mode**: Dark backgrounds (`#1f1f1e`), light text (`rgb(223, 223, 221)`)
-   **Default Blur**: `blur(3px)` for modal and overlay, `blur(12px)` for sticky header
-   **Default Overlay**: `rgba(0, 0, 0, 0.4)` (light) or `rgba(0, 0, 0, 0.6)` (dark)

## Source: `packages/vechain-kit/src/utils/swap/README.md`

# Swap Aggregators Configuration

## Overview

The swap aggregator system provides a unified interface for interacting with multiple DEX aggregators on VeChain. Each aggregator implements the `SwapAggregator` interface, allowing the system to fetch quotes, simulate transactions, and build executable transaction clauses.

## Process Flow

### 1. Aggregator Initialization

```typescript
const aggregators = getSwapAggregators(networkType);
```

The `getSwapAggregators` function returns an array of configured aggregators for the specified network (main, test, or solo). Currently supported aggregators:

- **VeTrade.vet**: API-based aggregator that returns complex swap instructions
- **BetterSwap.io**: Uniswap V2 compatible router-based aggregator

### 2. Quote Fetching

For each aggregator, the system calls `getQuote()`:

```typescript
const quote = await aggregator.getQuote(params, thor);
```

**Input Parameters (`SwapParams`):**
- `fromTokenAddress`: Source token address (use `0x` or zero address for native VET)
- `toTokenAddress`: Destination token address
- `amountIn`: Input amount in raw format (Wei)
- `userAddress`: Address of the user making the swap
- `slippageTolerance`: Optional slippage percentage (default: 1%)

**Output (`SwapQuote`):**
- `aggregatorName`: Name of the aggregator
- `aggregator`: Reference to the aggregator instance
- `outputAmount`: Expected output amount (bigint)
- `minimumOutputAmount`: Minimum output considering slippage (bigint)
- `priceImpact`: Optional price impact percentage
- `data`: Aggregator-specific data (clauses, paths, etc.)

### 3. Transaction Simulation

After obtaining quotes, each quote is simulated to estimate gas costs and verify execution:

```typescript
const simulation = await aggregator.simulateSwap(params, quote, thor);
```

**Simulation Process:**
1. Builds transaction clauses using `buildSwapTransaction()`
2. Simulates the transaction on the VeChain network
3. Calculates gas costs (converted to VTHO)
4. Verifies token inflows/outflows match expected amounts
5. Checks for transaction reverts

**Output (`SwapSimulation`):**
- `gasCostVTHO`: Estimated gas cost in VTHO
- `success`: Whether simulation succeeded
- `error`: Error message if simulation failed

### 4. Quote Selection

The system filters and ranks quotes:
- Filters out quotes with zero output amounts
- Filters out quotes that reverted during simulation
- Selects the quote with the highest `outputAmount` among non-reverted quotes

### 5. Transaction Execution

When a user executes a swap:

```typescript
const clauses = await quote.aggregator.buildSwapTransaction(params, quote);
await sendTransaction(clauses);
```

The aggregator builds the final transaction clauses, which are then sent to the network.

## Clause Building

Each aggregator implements `buildSwapTransaction()` to construct VeChain transaction clauses. The implementation varies by aggregator type:

### Uniswap V2 Compatible

Use direct contract calls to a Uniswap V2 compatible router.

**For VET-to-Token swaps:**
1. Single clause: `swapExactETHForTokens`
   - Sends VET as `value` in the clause
   - Parameters: `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → VET swaps:**
1. Approve clause: `approve` on the ERC20 token
   - Approves router to spend `amountIn`
2. Swap clause: `swapExactTokensForETH`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → Token swaps:**
1. Approve clause: `approve` on the ERC20 token
2. Swap clause: `swapExactTokensForTokens`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**Path Construction:**
- Native VET is replaced with wrapped VET (WVET) address in paths
- Path: `[fromToken, toToken]` (direct swap) or multi-hop paths

**Deadline:**
- Set to 20 minutes from current time (Unix timestamp)

### API-Based

Fetches interface and parameters from an API and encodes function calls locally.

**Process:**
1. Fetches quote from API endpoint
2. Receives clauses with function call specifications (ABI, function name, args)
3. Encodes function calls locally using viem's `encodeFunctionData`
4. Filters clauses to only include those targeting supported addresses to ensure interaction is limited to whitelisted contracts
5. Adds approve clause if swapping from ERC20 token (not VET)

**Clause Structure:**
- Each clause contains: `to`, `value`, `data` (encoded function call), `comment`
- Function calls are encoded using the ABI and arguments provided by the API

**Approve Clause Addition:**
- If `fromTokenAddress` is not VET, an approve clause is prepended
- Approves the router (first supported address) to spend `amountIn`

## Expected API Output

The API returns quotes in the following format:

### Request

Sample from VeTrade.vet:

```text
GET https://vetrade.vet/api/quote/vck?fromAddress={tokenAddress}&toAddress={tokenAddress}&amountIn={amount}&recipient={userAddress}&slippageBps={basisPoints}&network={networkType}
```

**Query Parameters:**
- `fromAddress`: Source token address (hex string)
- `toAddress`: Destination token address (hex string)
- `amountIn`: Input amount as decimal string
- `recipient`: User address receiving output tokens
- `slippageBps`: Slippage in basis points (e.g., 100 = 1%)
- `network`: Network type (`main`, `test`, or `solo`)

### Response

```typescript
interface APIQuoteResponse {
    amountOut: string;              // Expected output amount (decimal string)
    amountOutMin: string;            // Minimum output with slippage (decimal string)
    clauses: Array<{
        to: string;                 // Contract address to call
        value: string;              // VET value to send (hex or decimal string)
        comment?: string;           // Optional description
        functionCall: {
            functionName?: string;  // Function name (or use 'name')
            name?: string;          // Alternative function name field
            abi: Abi | Array<{      // Function ABI or inputs array
                name: string;
                type: string;
                internalType?: string;
                components?: Array<{...}>; // For struct types
            }>;
            args: unknown[];        // Function arguments
        };
    }>;
    path: string[];                 // Token swap path
}
```

### Response Example

```json
{
  "amountOut": "1000000000000000000",
  "amountOutMin": "990000000000000000",
  "clauses": [
    {
      "to": "0xE5fA980a6EfE5B79C2150a529da06AeF455963b6",
      "value": "0",
      "comment": "Swap on VeTrade",
      "functionCall": {
        "functionName": "swapExactTokensForTokens",
        "abi": [
          {
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "name": "path",
            "type": "address[]"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "args": [
          "1000000000000000000",
          "990000000000000000",
          ["0xTokenA", "0xTokenB"],
          "0xUserAddress",
          "1234567890"
        ]
      }
    }
  ],
  "path": ["0xTokenA", "0xTokenB"]
}
```

### ABI Format Handling

The API may provide ABIs in two formats:

1. **Full Function ABI**: Complete function definition with `name`, `type`, `inputs`, `outputs`, `stateMutability`
2. **Inputs Array**: Just the inputs array, which is converted to a full function ABI locally

The system normalizes both formats before encoding function calls.

### Clause Filtering

Only clauses targeting addresses in `supportedAddresses` are used. This ensures security by restricting which contracts can be called.

## Adding New Aggregators

To add a new aggregator:

1. **Create aggregator module** in `packages/vechain-kit/src/utils/swap/`
   - Implement the `SwapAggregator` interface
   - Export a factory function (e.g., `createMyAggregator`)

2. **Import and register** in `swapAggregators.ts`:
   ```typescript
   import { createMyAggregator } from '@/utils/swap/myAggregator';

   export const getSwapAggregators = (networkType: NETWORK_TYPE): SwapAggregator[] => [
       createVeTradeAggregator(networkType),
       createBetterSwapAggregator(networkType),
       createMyAggregator(networkType), // Add here
   ];
   ```

3. **Implement required methods:**
   - `getQuote()`: Fetch or calculate swap quote
   - `simulateSwap()`: Simulate transaction execution
   - `buildSwapTransaction()`: Build transaction clauses
   - `name`: Display name
   - `getIcon()`: React icon component

## Network Configuration

Each aggregator must handle three network types:

- **main**: VeChain mainnet
- **test**: VeChain testnet
- **solo**: Local VeChain Solo network

Network-specific addresses and endpoints are configured within each aggregator module.

## Error Handling

- **Quote failures**: Return quote with `outputAmount: 0n` (filtered out)
- **Simulation failures**: Quote marked with `reverted: true` and `revertReason`
- **Transaction building failures**: Throw error to prevent execution
- **API failures**: Log error and return empty quote

## Gas Estimation

Gas costs are calculated during simulation:
- Base gas: 200,000 units (VeChain transaction base cost)
- Additional gas per clause: `gasUsed` from simulation result
- Conversion: `gasCostVTHO = totalGas / 1e5`

## Token Flow Verification

During simulation, the system verifies:
- **Outflow**: User's token outflow matches `amountIn`
- **Inflow**: User's token inflow meets `minimumOutputAmount` (if specified)

This verification works for both ERC20 tokens and native VET, ensuring swap integrity.
