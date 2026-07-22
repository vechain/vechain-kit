# VeChain Kit — Curated integration guide

This is the retrieval-first guide for common developer questions. It is grounded in the repository snapshot that contains `@vechain/vechain-kit` version `2.12.0`. When it conflicts with the package manifest, exported types, public export graph, implementation, maintained examples, or tests, those sources win.

## Product boundary

VeChain Kit is the batteries-included React/Next.js integration. It combines wallet connection, VeChain social login and Privy support, embedded wallets, smart accounts, fee delegation, blockchain/data hooks, transaction UI, account UI, theming, and localization.

Use `@vechain/dapp-kit-react` directly when the application only needs lightweight wallet connection, bundle size is critical, or the frontend is not React. dapp-kit does not provide VeChain Kit’s social-login orchestration, smart-account layer, rich modals, or broad data-hook catalog.

Never import from `@vechain/vechain-kit/src/...`. Verify that a symbol is reachable through the root package or another declared package export before recommending it.

## Installation and prerequisites

At this snapshot the package manifest declares these peer expectations:

-   React and React DOM 18;
-   Chakra UI 2.8.x;
-   TanStack React Query 5.64.x or compatible;
-   `@vechain/dapp-kit-react` 2.3.2;
-   Emotion and Framer Motion.

The public documentation recommends installing with legacy peer-dependency resolution when npm reports React/Chakra conflicts. Do not apply that flag blindly without explaining why the project needs it.

TypeScript must target ES2020 or newer because the VeChain SDK uses BigInt. Projects using TanStack Query with wagmi-backed values may need wagmi’s `hashFn` as `queryKeyHashFn` to avoid BigInt serialization errors.

## Provider setup

`VeChainKitProvider` belongs near the root of the client-side React tree. In Next.js, follow the maintained examples and dynamically import the provider with SSR disabled when the integration hits browser-only APIs.

Always choose the VeChain network explicitly:

```tsx
<VeChainKitProvider network={{ type: 'test' }}>{children}</VeChainKitProvider>
```

Supported built-in network types are `main`, `test`, and `solo`. A custom `nodeUrl` can override the node. `contractAddresses` applies partial overrides on top of the selected network’s `AppConfig`; inside React components, `useAppConfig()` is preferable to a static config lookup because it observes provider overrides.

Important provider areas include:

-   `dappKit`: allowed wallet sources, WalletConnect metadata/project id, persistence, logging, and modal behavior;
-   `privy`: own Privy app/client ids, appearance, embedded-wallet creation, login methods, and OAuth redirect behavior;
-   `loginMethods`: order, four-column layout width, recommended primary CTA, and the visible connection choices;
-   `feeDelegation`: sponsored delegator URL, generic delegator URL, delegation policy, and optional B3TR threshold behavior;
-   `loginModalUI`: app logo and description;
-   `network`, `contractAddresses`, `legalDocuments`, `theme`, language/currency, custom tokens, community tokens, and hidden account quick actions.

Read the exported `VechainKitProviderProps` type before asserting that a specific prop exists.

## Wallet and login choices

VeWorld, Sync2, and WalletConnect are self-custody wallet paths. VeChain social login and own-Privy login use embedded-wallet/cross-app flows and may surface a smart-account address as the active application account.

`useWallet()` separates concepts that must not be conflated:

-   the active `account` used by the dApp;
-   the underlying `connectedWallet`;
-   smart-account metadata and deployment/version state;
-   Privy user data when applicable;
-   connection source and flags;
-   disconnection behavior.

For social login, explain whether the dApp is using VeChain’s shared/whitelabel cross-app experience or its own Privy application. Own Privy credentials offer more direct control and inline methods; the shared route offers an ecosystem identity without each integrating dApp owning a Privy account. Method availability and UX must be checked against the current provider types, login implementation, and official docs.

WalletConnect needs a WalletConnect project id and correct dApp metadata. If WalletConnect is not required, omit that wallet source rather than shipping an empty project id.

## Smart accounts and fee delegation

Social-login users can operate through smart accounts. The smart-account contract may be deployed lazily on the first transaction, so “address exists” and “contract is deployed” are distinct states. Version and upgrade hooks exist because older smart accounts can require migration.

The generic delegator is the fallback path that lets users pay transaction fees with supported assets according to current Kit behavior. A dApp can instead configure an app-sponsored delegator URL for a gasless user experience. Never promise that a transaction is free without confirming the configured delegator and its policy.

When discussing a DIY Privy + dapp-kit implementation, warn that it requires correct EIP-712 authorization, nonce/replay protection, lazy deployment, version migration, and the official smart-account factory. Prefer VeChain Kit unless the application has a concrete requirement that the Kit cannot meet.

## Contract reads and React Query

Prefer `useCallClause` for contract reads when VeChain Kit exposes the needed pattern. Use a typed ABI/factory and stable arguments. Gate the query until required addresses and inputs exist.

Kit queries use a `VECHAIN_KIT` query-key prefix, which supports broad or targeted invalidation. Treat loading, refetching, error, and absent-data states separately in UI code.

Do not copy an internal hook merely because its file appears in the knowledge corpus. Verify its export through the public index graph.

## Transactions

Use the transaction hooks according to responsibility:

-   build/prepare clauses and transaction data before the user’s final click;
-   estimate gas/fees when the flow needs to show or select payment options;
-   submit through the Kit’s transaction hook so the correct wallet, smart-account, and fee-delegation path is used;
-   track receipt/status and expose pending, success, rejection, cancellation, and failure states.

Multi-clause transactions are atomic on VeChainThor: all clauses succeed or the transaction reverts. This does not remove the need to validate every target, value, calldata payload, token decimal, and amount.

For popup-based signing, do not put avoidable network fetches between the direct click and popup initiation. Pre-fetch required reads so browsers do not classify the later popup as unsolicited and block it.

For transfers, explicitly confirm:

-   `main`, `test`, or `solo`;
-   asset contract and decimals;
-   human amount versus base units;
-   recipient address/domain resolution;
-   active account type;
-   fee-delegation behavior;
-   irreversible transfer implications.

## Signing

VeChain Kit exposes message and typed-data signing surfaces. The concrete signing flow can differ between a self-custody wallet, an embedded wallet, cross-app social login, and a smart account. Do not claim signature equivalence without checking the current hook contract and implementation.

Certificates, plain messages, EIP-712 payloads, and transaction authorizations solve different problems. Preserve the domain, chain, signer, nonce, and replay-protection assumptions established by the current API.

## Components and modal hooks

The public package includes wallet/connect UI, transaction modal/toast UI, account UI, smart-account upgrade UI, legal-document UI, and common supporting components. It also exposes modal hooks for opening targeted flows from custom application controls.

Before showing component props, retrieve both the component implementation/types and its public export. Include state handling around any modal that initiates signing or asset movement.

## Theming and host-framework compatibility

VeChain Kit uses Chakra UI v2 internally. The theme API supports modal surface values, text color, accent, overlay, button variants, font settings, glass effects, and an optional mobile bottom-sheet presentation. Use the current `VechainKitThemeConfig` type; do not invent CSS-style property names.

Tailwind CSS v4 preflight can override Chakra/Kit styling. The documented compatibility approach keeps Tailwind’s theme and utility layers but omits its preflight reset.

When a Chakra v3 host passes design tokens into the Kit theme, use reactive CSS variable references rather than resolved color snapshots. In the maintained Chakra v3 example, `useChakraContext().token.var(...)` keeps Kit colors responsive to host theme changes.

## Language and currency

The provider accepts initial/current language and currency configuration plus change callbacks. A host app using react-i18next should synchronize in both directions:

1. host `languageChanged` events call the Kit’s language setter;
2. the provider’s language-change callback updates host i18n;
3. handlers guard against loops;
4. persistence is handled consistently by the host language detector/storage.

Do not ingest every locale JSON file into RAG. They repeat the same UI keys and make technical retrieval noisier; the generated corpus intentionally excludes them.

## Legal documents

The provider can present terms, privacy, and cookie documents with URL, version, required/optional acceptance, and optional display name. Incrementing a document version is the mechanism that makes a previously accepted user see it again. Legal-document configuration is product plumbing, not legal advice.

## Troubleshooting checklist

When diagnosing an integration, ask for:

-   VeChain Kit and package-manager versions;
-   React/Next.js and Chakra/Tailwind versions;
-   target network;
-   wallet/login source;
-   provider configuration with secrets redacted;
-   exact error and stack trace;
-   whether it occurs during SSR, connection, signing, submission, or receipt tracking;
-   a minimal reproduction when possible.

Common categories:

-   browser-only dependency evaluated during SSR;
-   incompatible peer versions or duplicate React/Chakra instances;
-   TypeScript target below ES2020;
-   BigInt query-key serialization;
-   missing WalletConnect project id/metadata;
-   login method incompatible with the selected Privy mode;
-   popup blocked because asynchronous work occurred after the user gesture;
-   Tailwind/Bootstrap reset overriding Kit UI;
-   static theme colors passed instead of live CSS variables;
-   wrong network or stale/overridden contract address;
-   confusion between connected wallet, embedded wallet, and smart-account address;
-   fee sponsor unavailable or configured for a different network/policy.

## Freshness

This corpus is generated from a repository snapshot. Exact versions, hosted URLs, contract addresses, third-party service requirements, and available login providers can change. Report the snapshot value, then direct freshness-sensitive users to the official docs, playground, GitHub repository, npm package, or support channel for live confirmation.
