<div align="center">
    <h1><code>vechain-kit</code></h1>
    <p>
        <strong>A all-in-one library for building VeChain applications.</strong>
    </p>
    <p>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=alert_status&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Quality Gate Status"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=security_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Security Rating"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=sqale_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Maintainability Rating"></a>
        <a href="https://github.com/vechain/vechain-dapp-kit/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    </p>
    <img src="https://i.ibb.co/k539SN7/kit-banner.png" alt="VeChain Kit Banner">
</div>

## Introduction

VeChain Kit is a library created to make it easy for developers to build VeChain applications.

It comes with:

-   Social login without the need to setup a Privy account
-   New interface over DAppKit for enchanced user experience
-   UI components you can use in your app (eg: TransactionModal)
-   Hooks to easily read data from blockchain (oracles, ve better dao, vepassport, vedelegate, etc.)
-   Hooks to write data to blockchain, you just need to provide the clauses

You can use the hooks to read data from the blockchain even if user is not connected to the app.

For detailed documentation about the kit and how to use it, visit our [VeChain Kit Docs](https://vechain-foundation-san-marino.gitbook.io/vechain-kit).

[NPM](https://www.npmjs.com/package/@vechain/vechain-kit)
[VeChain Kit Demo](https://sample-vechain-app-demo.vechain.org/)
[Smart Account Factory](https://vechain.github.io/smart-accounts-factory/)

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
