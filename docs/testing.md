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

| Level           | Where                                    | Runs in            | What it covers                                                                                                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit            | `packages/vechain-kit/src/**/*.test.ts`  | happy-dom (Vitest) | Pure functions: typed-data builders, gas math, VIP-191 assembly, delegator HTTP contract, formatting, address/hex utils, query keys, ERC-20 clause building, network config.                                                                                                                                                            |
| Hook / provider | `packages/vechain-kit/src/**/*.test.tsx` | happy-dom          | React behaviour with Privy and dapp-kit faked at the module boundary and a fake Thor node behind `fetch`: `useBuildClauses`, `PrivyWalletProvider.sendTransaction`, `useGenericDelegator`, `useSendTransaction`, `VeChainKitProvider` config mapping, full provider mount with the real `DAppKitProvider`, wagmi and cross-app-connect. |
| Package         | `packages/vechain-kit/test/`             | happy-dom / node   | Dependency-tree identity (one `valtio`, `react`, `react-dom`, `react-query` for the kit and the packages it composes) and a smoke test of the built bundle in `dist/` (exports present, ESM import, provider mounts).                                                                                                                   |
| Lambda          | `lambda/tests/`                          | node               | The Privy social-identifier lambda, unchanged tests moved from Jest to Vitest.                                                                                                                                                                                                                                                          |
| CI gate         | `scripts/ci-test-gate.test.mjs`          | node               | The change-detection script the required check relies on.                                                                                                                                                                                                                                                                               |

### Why these fakes

-   **Privy** is never real in tests. `test/mocks/privyReactAuth.tsx` exports
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
-   **Nothing reaches the network.** `test/setup.ts` replaces `fetch` with a
    404 stub before every test; a test that needs a server installs its own.

### Deliberately not tested

-   **Privy's own behaviour** (OTP flows, OAuth popups, embedded-wallet
    signing). It needs a live Privy app and real accounts and is Privy's
    contract to keep, not the kit's.
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

| Suite                                                   | Verdict                   | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/e2e/` (Playwright, 5 specs, all `describe.skip`) | **Deleted**               | Every spec was skipped since Oct 2025. The Privy specs log in with a shared OTP inbox (not automatable deterministically), the domain specs depend on public testnet state, and the VeWorld specs need the next-template app built against thor-solo where the smart-account factory does not exist. Keeping skipped specs implied coverage that did not exist. The page models are in git history if a browser suite is rebuilt (see follow-ups). |
| `.github/workflows/test-e2e.yaml`                       | **Deleted**               | Ran a fully skipped suite on every PR with a hard-coded Privy app id, unpinned actions and 60 s of sleeps.                                                                                                                                                                                                                                                                                                                                         |
| `lambda/tests/index.test.ts` (Jest)                     | **Kept, moved to Vitest** | Tests are sound (mocked axios and Privy server client). Same assertions, `jest.*` → `vi.*`, so the repo has one runner.                                                                                                                                                                                                                                                                                                                            |
| `.github/workflows/test-lambda.yml`                     | **Deleted**               | Only ran when the test file changed, so a change to `lambda/index.ts` never ran the tests. The lambda project now runs inside the required check.                                                                                                                                                                                                                                                                                                  |
| `CLAUDE.md` "no need to add tests"                      | **Replaced**              | Tests are expected next to the code they cover.                                                                                                                                                                                                                                                                                                                                                                                                    |

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

Workflow `.github/workflows/tests.yaml`, job **`Tests`** (the check to make
required on `main`).

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
-   Budget: locally the suite runs in about 6 s and the kit build in 14 s; the
    job is dominated by `yarn install` and should land around 3–5 minutes on a
    cold cache. Measure on the first runs and tighten this line.

## Handling flaky external dependencies

| Dependency                          | In the required check                                                           | Elsewhere                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Privy (auth API, embedded wallet)   | Module fake only.                                                               | Manual checklist on upgrade PRs; a non-required browser job is a follow-up. |
| Public Thor nodes                   | Fake node behind `fetch`.                                                       | thor-solo via `thor-solo/` for local integration runs (follow-up job).      |
| Fee delegators (sponsor, generic)   | Faked per test; the HTTP contract (paths, bodies, error surfacing) is asserted. | —                                                                           |
| IPFS, indexers, price APIs, app-hub | Not exercised. `fetch` returns 404 so an accidental call fails loudly.          | —                                                                           |

## Bugs noticed while writing the tests (not fixed here)

Kept out of this PR so the before/after comparison with #663 stays clean.

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
   still sets the deprecated key (#663 moves it).

## Gaps and follow-ups, in priority order

1. **Privy v3 real-mount check.** Add a test file that mounts the real
   `PrivyProvider` with `fetch` stubbed, to catch an init-time crash of a new
   Privy major. Needs a decision on how much of Privy's bootstrap to stub.
2. **thor-solo integration job (non-required).** Spin up `thor-solo/` in a
   separate job and run the VIP-191 send path end to end with a locally
   signing gas payer against the real node, plus `useCallClause` against the
   built-in VTHO contract. Everything needed is in the repo; it costs a
   Docker pull per run, which is why it is not in the required check.
3. **Smart-account contract fixture.** Publish or vendor the
   `SocialLoginSmartAccountFactory` bytecode so the authorization typed data
   can be verified by the contract on thor-solo, not only recovered locally.
4. **Component tests for the modals.** ConnectModal login-method grid
   (ordering, `isPrimary`, Privy-less fallbacks) and AccountModal send flow
   with the fake node. The theme/colour-mode fixes were the largest group of
   UI regressions.
5. **Formatting and currency.** `formatCurrencyValue` narrow symbol per
   locale (#616), `useGetCustomTokenBalances` decimals, swap utilities.
6. **Browser smoke of the built example (non-required, needs a decision).**
   Build `examples/next-template` and load it headless to assert no runtime
   error on page load; the veworld-mock packages from the deleted suite can
   drive a VeWorld connect. Requires maintainers to accept a Playwright
   install in CI and, for Privy flows, a dedicated Privy test app and
   secrets.
7. **Node 20.18 is end-of-life.** Bumping `.nvmrc` to 20.19 or 22 would
   unblock jsdom and current Vite; it is a repo decision, not a test one.
