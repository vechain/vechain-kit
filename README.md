![Zizmor Checks](https://github.com/vechain/vechain-kit/actions/workflows/scan-workflows.yaml/badge.svg?branch=main&event=push)

#### An all-in-one library for building VeChain applications.

<div align="center">
    <img src="https://i.ibb.co/NgDN6XD3/kit-preview.png" alt="VeChain Kit Banner">
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

-   [Live Demo](https://vechainkit.vechain.org/)
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
