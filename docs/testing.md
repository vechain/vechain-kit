# Testing strategy

How VeChain Kit is tested, what is deliberately left out, and what comes next.
Run everything with `yarn test` (add `--coverage` via `yarn test:coverage`).

## What the kit has to get right

VeChain Kit is glue between three things it does not own: Privy (social login,
embedded wallet signatures), dapp-kit (VeWorld, Sync2, WalletConnect) and the
Thor node. Its own logic is concentrated in a few places, and the bug history
of the last year clusters there too:

-   the Privy smart-account path: EIP-712 authorizations signed by the embedded
    wallet, executed through the user's smart account by a throwaway wallet, fee
    delegated (#597, #598, #651);
-   generic-delegator gas and fee math (#623, #651);
-   provider configuration: how `VeChainKitProvider` props become the config of
    `PrivyProvider`, `DAppKitProvider` and `PrivyWalletProvider` (the v3
    `createOnLogin` move was a silent misconfiguration);
-   token decimals, number formatting and query-key serialisation (#603, #604,
    #616, BigInt serialisation);
-   the dependency tree: a second `valtio` copy made `DAppKitProvider` crash on
    page load while every example still built.

The suite is shaped around those, not around line coverage.

## Levels

| Level           | Where                                    | Runs in                                                                  | What it covers                                                                                                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit            | `packages/vechain-kit/src/**/*.test.ts`  | happy-dom (Vitest)                                                       | Pure functions: typed-data builders, gas math, VIP-191 assembly, delegator HTTP contract, formatting, address/hex utils, query keys, ERC-20 clause building, network config.                                                                                                                                                            |
| Hook / provider | `packages/vechain-kit/src/**/*.test.tsx` | happy-dom                                                                | React behaviour with Privy and dapp-kit faked at the module boundary and a fake Thor node behind `fetch`: `useBuildClauses`, `PrivyWalletProvider.sendTransaction`, `useGenericDelegator`, `useSendTransaction`, `VeChainKitProvider` config mapping, full provider mount with the real `DAppKitProvider`, wagmi and cross-app-connect. |
| Package         | `packages/vechain-kit/test/`             | happy-dom / node                                                         | Dependency-tree identity (one `valtio`, `react`, `react-dom`, `react-query` for the kit and the packages it composes) and a smoke test of the built bundle in `dist/` (exports present, ESM import, provider mounts).                                                                                                                   |
| Lambda          | `lambda/tests/`                          | node                                                                     | The Privy social-identifier lambda, unchanged tests moved from Jest to Vitest.                                                                                                                                                                                                                                                          |
| CI gate         | `scripts/ci-test-gate.test.mjs`          | node                                                                     | The change-detection script the required check relies on.                                                                                                                                                                                                                                                                               |
| E2E             | `tests/e2e/` (Playwright)                | Chromium against the built `next-template` and a Docker thor-solo        | VeWorld login, logout, session reload, rejected connection, transactions with toast and modal confirmed on chain, rejected signature, message and typed-data signing. `yarn test:e2e --project solo`.                                                                                                                                   |
| E2E testnet     | `tests/e2e/testnet/` (Playwright)        | Chromium against `next-template` built for testnet with a Privy test app | Privy email login and logout, session restore, smart-account transaction through the generic delegator, `.veworld.vet` claim, Backup up to Privy's export modal. Receipts are read back from testnet. `yarn test:e2e --project testnet`, see [Testnet E2E](#testnet-e2e).                                                               |

### Why these fakes

-   **Privy** is never real below the testnet E2E project. `test/mocks/privyReactAuth.tsx` exports
    exactly the surface the kit imports (`PrivyProvider`, `usePrivy`,
    `useLoginWithEmail`, …). Tests assert what the kit hands to Privy (typed
    data, `uiOptions`, provider config) and what it does with the result. If a
    Privy upgrade removes or renames one of those exports, `yarn kit:typecheck`
    and the import of the real module in the dist smoke test fail first.
-   **dapp-kit** is real wherever a mount is being tested (`VeChainKitProvider.mount`,
    dist smoke), because the valtio-style crash only shows with the real
    provider. It is faked (`test/mocks/dappKitReact.tsx`) where the test is
    about the kit's own routing, e.g. `useSendTransaction`.
-   **The chain** is `test/fakes/thorNode.ts`: an in-memory Thor REST API behind
    `fetch` (`/blocks/*`, `/accounts/*` simulation, `/accounts/{addr}`,
    `/transactions`, `/fees/*`). The real `@vechain/sdk-network` client runs
    against it, so gas estimation, body building and VIP-191 signing are the
    real code paths. Fee delegators (dApp-sponsored and generic) are faked per
    test as a few lines of `otherHosts` routing; they co-sign with a known key so
    the test can recover `origin` and `gasPayer` from the broadcast bytes.
-   **Nothing reaches the network** in the unit tier. `test/setup.ts` replaces `fetch` with a 404 stub before every test; a test that needs a server installs its own.
-   **VeWorld in E2E** is `tests/e2e/fixtures/veworld.ts`: a `window.vechain` shim speaking dapp-kit's v2 `request` API, backed by a Node signer holding a thor-solo genesis key. Every transaction is really signed and mined on solo, and the test reads the receipt back. The maintained `@vechain/veworld-mock` only implements the v1 Connex signer, which dapp-kit 2.3 no longer uses by default. The example app runs in opt-out mode (no Privy app id) on solo; the kit still fetches VeChain's Privy app config once at load, the one live third-party call in the E2E tier (see finding 6 below).

### Deliberately not tested

-   **Privy's OAuth providers** (Google, Apple, …) and wallet linking. OAuth
    needs real third-party accounts; the testnet project covers the email
    OTP path with a Privy test account instead.
-   **Modal UI pixel/visual regressions.** The AccountModal fixes of the last
    year were visual; a screenshot suite needs a browser matrix and a review
    process the team has not set up. Component tests of modal behaviour are a
    follow-up, not a visual diff.
-   **Indexer, IPFS, price and app-hub APIs.** The hooks are thin `useQuery`
    wrappers over external services; mocking them tests `react-query`.
-   **Smart-account contracts on chain.** `@vechain/vechain-contract-types`
    ships ABIs without bytecode, so the factory cannot be deployed on thor-solo
    from this repo. The typed data is instead verified locally (sign and recover
    with viem, stable EIP-712 digest) and decoded with the contract ABI.

## Verdict on the existing tests

| Suite                                                   | Verdict                   | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/e2e/` (Playwright, 5 specs, all `describe.skip`) | **Deleted and rebuilt**   | Every spec was skipped since Oct 2025. The Privy specs log in with a shared OTP inbox (not automatable deterministically), the domain specs depend on public testnet state, and the VeWorld specs need the next-template app built against thor-solo where the smart-account factory does not exist. Keeping skipped specs implied coverage that did not exist. Rebuilt as a VeWorld-only suite against thor-solo with a v2 wallet shim; the Privy and testnet flows are tier 2 (see follow-ups). |
| `.github/workflows/test-e2e.yaml`                       | **Deleted**               | Ran a fully skipped suite on every PR with a hard-coded Privy app id, unpinned actions and 60 s of sleeps.                                                                                                                                                                                                                                                                                                                                                                                        |
| `lambda/tests/index.test.ts` (Jest)                     | **Kept, moved to Vitest** | Tests are sound (mocked axios and Privy server client). Same assertions, `jest.*` → `vi.*`, so the repo has one runner.                                                                                                                                                                                                                                                                                                                                                                           |
| `.github/workflows/test-lambda.yml`                     | **Deleted**               | Only ran when the test file changed, so a change to `lambda/index.ts` never ran the tests. The lambda project now runs inside the required check.                                                                                                                                                                                                                                                                                                                                                 |
| `CLAUDE.md` "no need to add tests"                      | **Replaced**              | Tests are expected next to the code they cover.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Runner and configuration

**Vitest 4** with **happy-dom**, configured once at the repo root
(`vitest.config.mts`) with three projects: `kit`, `lambda`, `scripts`.

-   The kit is ESM, built by tsdown; Vitest runs TypeScript and JSX through
    esbuild with the kit's `tsconfig` path aliases and no second toolchain. Jest
    would need ts-jest or Babel and CJS interop shims for viem and the SDK.
-   `@vechain/dapp-kit*` are inlined (`server.deps.inline`) because their ESM
    dists import named exports from a CommonJS module, which Node refuses but
    bundlers accept.
-   **happy-dom, not jsdom.** The repo pins Node 20.18.3 (`.nvmrc`); jsdom 27's
    dependency chain requires `require(esm)` (Node ≥ 20.19) and jsdom 26's
    typed arrays break `Buffer` checks in secp256k1 code. happy-dom 20 runs on
    20.18 unchanged. If Node is bumped, jsdom becomes an option again.
-   Versions are pinned exactly (`vitest 4.1.11`, `vite 6.3.6`,
    `happy-dom 20.14.5`, `@testing-library/react 16.3.3`); `vite`, `rollup`
    and `postcss` are held in root `resolutions` so Vitest cannot drift onto a
    Vite that needs a newer Node. Every new lockfile entry is at least 7 days
    old on npm.
-   Test files are part of the kit's `tsconfig`, so `yarn kit:typecheck` and
    `yarn build` type-check them. A Privy or dapp-kit type change that breaks a
    test is caught before the test runs.

## Coverage

`yarn test:coverage` writes `coverage/` (text summary, `lcov`, JSON) and the
CI job summary shows the totals. Overall line coverage after this change is
about 24% of the kit, which says more about the size of the UI tree than
about risk.

**Policy: floors on the hot spots, no global threshold, no ratchet file.**

| File                                             | Lines | Functions |
| ------------------------------------------------ | ----- | --------- |
| `hooks/utils/useBuildClauses.ts`                 | 85%   | 85%       |
| `hooks/generic-delegator/useGenericDelegator.ts` | 85%   | 85%       |
| `providers/PrivyWalletProvider.tsx`              | 85%   | 85%       |
| `providers/VeChainKitProvider.tsx`               | 70%   | 60%       |

A global threshold at 24% would be noise, and a committed ratchet file turns
every unrelated PR into a coverage negotiation. The floors sit a few points
under what the suite reaches today and fail a PR that removes tests from the
code that has bitten users. Raise them, or add files, when tests are added.

## CI

Workflow `.github/workflows/tests.yaml`, jobs **`Tests`** and **`E2E`** (the two checks to make required on `main`).

-   Triggers: every `pull_request`; every push to `main` (always full).
-   One job, always reports. Skipping is decided inside the job by
    `scripts/ci-test-gate.mjs`, never by a workflow `paths` filter, so the
    check can never be left pending. It fails closed: the tests run unless
    **every** changed file matches the ignore list (`**/*.md`, `docs/**`,
    `LICENSE`, `CNAME`, images, `.github/ISSUE_TEMPLATE/**`, `CODEOWNERS`,
    `.cursor/**`, `.claude/**`), and also run when the changed-file list cannot
    be computed. A skip still succeeds and writes the reason to the job summary.
-   Steps: checkout (`persist-credentials: false`, full history for the
    merge-base diff), Node from `.nvmrc`, `yarn install --immutable`,
    `yarn kit:build` (for the dist smoke test), `yarn test:coverage`, coverage
    table in the summary. No secrets, no network beyond npm and the actions.
-   Conventions: `permissions: {}` at the top, `contents: read` for the job,
    actions pinned to commit SHAs, no `${{ }}` inside `run:`. Passes
    `zizmor --persona auditor --min-severity medium --min-confidence high`.
-   `E2E` repeats the gate, starts thor-solo with Docker Compose (11 s locally), builds the kit and `next-template` for solo (27 s), installs Chromium and runs Playwright (25 s for 9 tests). It uploads the Playwright report on failure. It depends on the `ghcr.io/vechain/thor` image pull and on one GET to Privy's app config; no secrets.
-   `E2E (testnet)` runs in the `e2e-test` environment and skips with a summary line when its secrets are absent (fork and Dependabot PRs). It is not a required check until it has been stable for a few weeks. Traces are off in that project, and screenshots are off during login, so the report never contains the test code or session tokens.
-   Budget: locally the unit suite runs in about 6 s and the kit build in 14 s; `Tests` is dominated by `yarn install` and should land around 3–5 minutes on a cold cache, `E2E` around 5–7 minutes. Measure on the first runs and tighten this line.

## Handling flaky external dependencies

| Dependency                          | In the required check                                                                                        | Elsewhere                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Privy (auth API, embedded wallet)   | Module fake only. In E2E one live GET of the app config at page load (blocking it hangs the kit, finding 6). | Testnet E2E with a Privy test account; a Privy outage shows as a timeout. |
| VeWorld extension                   | Not used.                                                                                                    | E2E: Node-side v2 wallet shim with a solo key.                            |
| Public Thor nodes                   | Fake node behind `fetch`.                                                                                    | E2E: thor-solo in Docker, started per run.                                |
| Fee delegators (sponsor, generic)   | Faked per test; the HTTP contract (paths, bodies, error surfacing) is asserted.                              | —                                                                         |
| IPFS, indexers, price APIs, app-hub | Not exercised. `fetch` returns 404 so an accidental call fails loudly.                                       | —                                                                         |

## Testnet E2E

One-time setup, by maintainers:

-   **Privy app.** A separate development app (not the production one) with email login and "Enable test accounts" on (User management > Authentication > Advanced). Toggling test accounts off and on issues new credentials.
-   **Secrets.** In the `e2e-test` environment: `E2E_PRIVY_APP_ID`, `E2E_PRIVY_TEST_EMAIL`, `E2E_PRIVY_TEST_CODE`, and optionally `E2E_PRIVY_CLIENT_ID` (Privy falls back to the app's default client). Only the app and client ids go into the build; the email and code are read by the runner.
-   **Funds.** The smart-account transaction pays gas in VET through the generic delegator. The setup logs the account's address (it never changes for the test user); send it testnet VET from https://faucet.vecha.in and top it up when the spec says so. Domain claims are sponsored and need nothing.

Run locally with the same variables exported:

```bash
yarn kit:build
NEXT_PUBLIC_NETWORK_TYPE=test NEXT_PUBLIC_PRIVY_APP_ID=… NEXT_PUBLIC_PRIVY_CLIENT_ID=… yarn workspace next-template build
yarn test:e2e --project testnet
```

The setup project logs in once and saves the session to `tests/e2e/.auth/` (gitignored); the logout spec logs in separately so it never revokes the shared session. Selectors for Privy's own modal (signature approval, key export) live in `tests/e2e/fixtures/privy.ts`. The email and OTP inputs and the profile avatar carry `data-testid`s added for these tests.

## Bugs noticed while writing the tests (not fixed here)

Kept out of this PR so it changes no runtime behaviour.

1. `VeChainKitProvider` seeds the generic delegator URL from
   `localStorage['vechain-kit:network']`, which it only writes in an effect
   after the first render. A first visit on mainnet with empty storage
   therefore starts with the **testnet** delegator URL until something
   re-renders the provider.
2. `PrivyWalletProvider.sendTransaction` returns the simulation `vmError`
   string instead of throwing when the pre-flight simulation reverts, so
   `useSendTransaction` stores it as a transaction id.
3. `useGenericDelegator`, `useGenericDelegatorFeeEstimation` and
   `useEstimateAllTokens` build their `ThorClient` from
   `getConfig(network.type).nodeUrl`, ignoring a consumer's `network.nodeUrl`
   override that `PrivyWalletProvider` and `useGetNodeUrl` honour.
4. `applyDAppKitButtonStyles` registers a `MutationObserver` on
   `document.body` that is never disconnected (one per provider mount).
5. On `@privy-io/react-auth` 2.25.0 `embeddedWallets.createOnLogin` is already
   deprecated in favour of `embeddedWallets.ethereum.createOnLogin`; the kit
   still sets the deprecated key.
6. `connection.isLoading` waits for Privy's `ready`, so when `auth.privy.io` is unreachable every kit app, including VeWorld-only ones, stays on its loading state. Found by blocking that host in the E2E fixture.
7. `estimateGas` in `useGenericDelegator` calls `response.json()` without checking the status, so a delegator outage (HTML 503) surfaces as "no gas tokens have sufficient balance or are enabled in Gas Token Preferences". Seen on testnet on 2026-10-15.

## Manual checklist coverage

The maintainers' pre-release checklist, and where each item stands.

| Item                                           | Status                                                                     | Where                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------- |
| VeWorld login, logout                          | Automated                                                                  | `tests/e2e/tests/connect.spec.ts`       |
| VeWorld transactions (toast, modal, rejection) | Automated, confirmed on chain                                              | `tests/e2e/tests/transactions.spec.ts`  |
| Sign message, sign typed data (VeWorld)        | Automated                                                                  | `tests/e2e/tests/signing.spec.ts`       |
| Social login, logout                           | Automated (email test account, testnet)                                    | `tests/e2e/testnet/session.spec.ts`     |
| Linking wallets                                | Manual                                                                     | Which flow it means is undecided.       |
| Social (smart-account) transactions            | Automated, confirmed on testnet                                            | `tests/e2e/testnet/transaction.spec.ts` |
| Domain names                                   | Automated, fresh `.veworld.vet` subdomain per run                          | `tests/e2e/testnet/domain.spec.ts`      |
| Mnemonic backup                                | Automated up to Privy's export modal; the key is never revealed            | `tests/e2e/testnet/backup.spec.ts`      |
| Hooks in the playground                        | Chain hooks automated against solo and the fake node; indexer hooks manual | Testnet-backed nightly is tier 2.       |

## Gaps and follow-ups, in priority order

1. **Make `E2E (testnet)` required** once it has been stable for a few weeks.
2. **Privy v3 real-mount check.** Add a test file that mounts the real `PrivyProvider` with `fetch` stubbed, to catch an init-time crash of a new Privy major. Needs a decision on how much of Privy's bootstrap to stub.
3. **Smart-account contract fixture.** Publish or vendor the `SocialLoginSmartAccountFactory` bytecode so the authorization typed data can be verified by the contract on thor-solo, not only recovered locally, and so smart-account E2E can run on solo instead of testnet.
4. **Component tests for the modals.** ConnectModal login-method grid (ordering, `isPrimary`, Privy-less fallbacks) and AccountModal send flow with the fake node. The theme/colour-mode fixes were the largest group of UI regressions.
5. **More VeWorld E2E.** Account switching (a second solo key is in the fixture), language and currency switching, the account modal send flow.
6. **Formatting and currency.** `formatCurrencyValue` narrow symbol per locale (#616), `useGetCustomTokenBalances` decimals, swap utilities.
7. **Node 20.18 is end-of-life.** Bumping `.nvmrc` to 20.19 or 22 would unblock jsdom and current Vite; it is a repo decision, not a test one.
