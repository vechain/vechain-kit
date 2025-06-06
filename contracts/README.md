# VeChain Hardhat Template

A complete development environment template for building smart contracts on VeChain using Hardhat. This template comes pre-configured with everything you need to start developing, testing, and deploying smart contracts on VeChain networks.

## Features

- ✅ Hardhat configuration for VeChain networks (Solo, Testnet, Mainnet)
- 🐳 Thor-Solo instance for local development
- 📦 Upgradeable smart contracts templates
- 🧪 Comprehensive test suite setup
- 🔧 Deploy and upgrade scripts
- 🎭 Mock contracts for common VeChain contracts

## Prerequisites

- Node.js v20 (version specified in `.nvmrc`)
- Yarn or npm
- Docker (for running Thor-Solo)

## Installation

1. Install dependencies:

```bash
yarn install
```

2.  Create your environment file:

```bash
cp .env.example .env
```

## Usage

### Local Development

1. Start the Thor-Solo instance:

```bash
yarn start-solo
```

### Compile

```bash
yarn compile
```

### Deploy

```bash
yarn deploy:solo
```

or

```bash
yarn deploy:testnet
```

or

```bash
yarn deploy:mainnet
```

### Verify (Optional)

Optionally verify your smart contracts on Sourcify. This allows 3rd to view and independently verify all of the following:

- Source code
- Metadata
- Contract ABI
- Contract Bytecode
- Contract transaction ID

After deploying `SimpleStorage`, the console will print the address of the deployed contract. You can verify the contract on [sourcify.eth](https://repo.sourcify.dev/select-contract/):

```bash
yarn hardhat verify --network vechain_testnet 0x98307db87474fc30d6e022e2b31f384b134c2c2a
```

**Note:** Hardhat throws an error when verifying contracts on VeChain networks. This error can be ignored as the contract is still verified on Sourcify. See an [example here](https://repo.sourcify.dev/contracts/full_match/100010/0x98307db87474fC30D6E022E2b31f384B134C2c2A/sources/contracts/)

### Test

```bash
yarn test
```

or to generate a coverage report:

```bash
yarn test:coverage:solidity
```

Will generate the coverage report in the `coverage` folder, open the `index.html` file in your browser to see the report.

### Generate Docs

```bash
yarn generate-docs
```

Will generate the docs in the `docs` folder.

## Warning

This template is using the `@openzeppelin/contracts-upgradeable` `v5.0.2` and `@openzeppelin/contracts` `v5.0.2` in order to be compatible with the VeChain Solidity compiler version of `0.8.20`.
