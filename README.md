#### An all-in-one library for building VeChain applications.

<div align="center">
    <img src="https://i.ibb.co/NgDN6XD3/kit-preview.png" alt="VeChain Kit Banner">
</div>

## Introduction

VeChain Kit is a comprehensive library designed to make building VeChain applications fast and straightforward.

It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, VeChain Embedded Wallet, and social logins (powered by Privy).
-   <b>Unified Ecosystem Accounts:</b> Leverage Privy’s Ecosystem feature to give users a single wallet across multiple dApps, providing a consistent identity within the VeChain network.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.
-   <b>Multi-Language Support:</b> Built-in i18n for a global audience.
-   <b>Token Operations:</b> Send tokens, check balances, manage VET domains, and more—all in one place.

> **Note**: Currently supports React and Next.js only

📚 For detailed documentation, visit our [VeChain Kit Docs](https://docs.vechainkit.vechain.org/)

## Demo & Examples

-   [Live Demo](https://vechainkit.vechain.org/)
-   [Sample Next.js App](https://github.com/vechain/vechain-kit/tree/main/examples/next-template)
-   [Smart Account Factory](https://vechain.github.io/smart-accounts/)
-   [Docs](https://docs.vechainkit.vechain.org/)

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
