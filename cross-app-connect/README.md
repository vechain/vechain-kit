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
