<div align="center">
    <h1><code>vechain-kit</code></h1>
    <p>
        <strong>A TypeScript library that facilitates seamless interaction between VeChain wallets.</strong>
    </p>
    <p>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=alert_status&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Quality Gate Status"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=security_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Security Rating"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=sqale_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Maintainability Rating"></a>
        <a href="https://github.com/vechain/vechain-dapp-kit/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    </p>
</div>

## Introduction

VeChain Kit is a TypeScript library that simplifies wallet connections for VeChain applications. It provides a unified interface for multiple wallet providers including VeWorld, Sync2, Privy, and Login with VeChain.

This kit also provides components and hooks for reading and writing to the VeChainThor blockchain.

Currently only supported for React and NextJS.

For detailed documentation, visit our [VeChain Kit Docs](https://vechain-foundation-san-marino.gitbook.io/social-login-dappkit-privy/~/changes/3deX4SvayBeNDBaxivMg).

### We currently only support React and Next.js.

## Table of Contents

-   [Setting up for local development](#setting-up-for-local-development)
-   [Branching Strategy](#branching-strategy)
-   [E2E Testing](#e2e-testing)
-   [Publishing](#publishing)

# Setting up for local development

### Prerequisites

-   Node.js >= 18.17
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

We utilize Cucumber.js with Selenium for end-to-end (E2E) testing. To conduct these tests, you'll require the ChromeDriver. Here's how to install it:

**On Mac:**

```shell
brew install chromedriver
cd "$(dirname "$(which chromedriver)")"
xattr -d com.apple.quarantine chromedriver
```

Once installed, you can run tests in the browser using:

```bash
yarn test:e2e
```

Alternatively, you can run headless tests directly in the console using:

```bash
yarn test:e2e:headless
```

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
