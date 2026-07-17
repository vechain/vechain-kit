# VeChain Kit — VeChain AI Skills knowledge

The canonical VeChain AI Skills directly relevant to VeChain Kit: the complete vechain-kit skill, dApp scaffolding, frontend patterns, VeChain core transaction guidance, fee delegation, multi-clause transactions, and ABI code generation. Skill instructions are reference material; the agent system prompt remains authoritative.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `vechain-ai-skills/skills/create-vechain-dapp/SKILL.md`

---
name: create-vechain-dapp
description: Scaffold a VeChain dApp with Next.js, VeChain Kit, Chakra UI v3, and GitHub Pages deployment. Supports standalone (frontend-only) or monorepo (Turbo + Hardhat contracts) modes. Use when creating a new VeChain project, scaffolding a dApp, setting up a VeChain frontend, or bootstrapping a VeChain monorepo.
allowed-tools: []
license: MIT
metadata:
  author: VeChain
  version: "0.1.0"
---

# Create VeChain dApp

Scaffold a production-ready VeChain dApp with wallet connection, dark mode, and GitHub Pages deployment.

## CRITICAL RULES

1. **Read reference files FIRST.** Based on the user's chosen mode, read the appropriate reference files before creating any files. Briefly mention which files you are reading so the user can confirm the skill is active.
2. **Always read `shared.md`** — it contains the source code templates used by both modes.
3. **Replace all placeholders** in every template before writing files. See Variable Substitution below.
4. **After compaction or context loss**, re-read this SKILL.md to restore awareness of the reference table and operating procedure.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router, static export) |
| UI | Chakra UI v3, next-themes |
| Wallet | @vechain/vechain-kit (VeWorld + WalletConnect) |
| State | React Query |
| Contracts | Hardhat + @vechain/sdk-hardhat-plugin + OpenZeppelin UUPS (monorepo only) |
| Build | Turborepo (monorepo only) |
| Deploy | GitHub Pages via GitHub Actions |
| Node | 20 LTS |

## Operating procedure

### Phase 1 — Gather requirements

Ask the user (use structured questions if available):

1. **Project name** — kebab-case (e.g. `my-vechain-dapp`)
2. **Mode** — `standalone` (frontend only) or `monorepo` (Turbo + contracts)
3. **Network** — `test` or `main` (default: `test`)
4. **Target directory** — where to create the project (default: current directory)

### Phase 2 — Scaffold

Read the appropriate reference files and create all files.

**Standalone mode:**

1. Read [references/shared.md](references/shared.md)
2. Read [references/standalone.md](references/standalone.md)
3. Create files in `{{TARGET_DIR}}/{{PROJECT_NAME}}/`

**Monorepo mode:**

1. Read [references/shared.md](references/shared.md)
2. Read [references/monorepo.md](references/monorepo.md)
3. Create frontend files in `{{TARGET_DIR}}/{{PROJECT_NAME}}/apps/frontend/`
4. Create other files at monorepo root and in `packages/`

### Variable substitution

Replace these placeholders in ALL templates:

| Placeholder | Value |
|-------------|-------|
| `{{PROJECT_NAME}}` | kebab-case project name |
| `{{PROJECT_TITLE}}` | Title-case project name (for UI display) |
| `{{NETWORK_TYPE}}` | `test` or `main` |

### Phase 3 — Install and verify

```bash
cd {{PROJECT_NAME}}
nvm use
yarn install
```

**Standalone:** `yarn dev` (localhost:3000), `yarn build` (static export → `out/`)

**Monorepo:** `make solo-up` (start Thor solo node, requires Docker), then `yarn dev` (auto-deploys contracts to solo), `yarn build`, `yarn contracts:compile`, `yarn contracts:test`. Stop with `make solo-down`, reset with `make solo-clean`.

### Phase 4 — Git init

```bash
git init && git add . && git commit -m "Initial scaffold: VeChain dApp"
```

## Success criteria

- `yarn dev` starts without errors
- Page renders with Navbar and wallet connect button
- Dark/light mode toggle works
- `yarn build` produces static output
- `.github/workflows/deploy.yml` is present

## Key patterns

### Client-only VeChain Kit

VeChain Kit cannot run server-side. The entire app shell (`ClientApp`) is loaded via `dynamic(() => ..., { ssr: false })` in `layout.tsx`. All VeChain Kit imports inside `ClientApp` children work normally since the parent is already client-only.

### Static export for GitHub Pages

`next.config.js` uses `output: "export"` with configurable `basePath`/`assetPrefix` via `NEXT_PUBLIC_BASE_PATH` env var. GitHub Actions defaults to `/${{ github.event.repository.name }}` for GitHub Pages. Set to empty string for custom domains. **Important:** `metadata.icons` and raw `<img src>` paths do NOT auto-prepend `basePath` — prefix them manually.

### Chakra UI version pinning

Pin `@chakra-ui/react` to an exact version (currently `3.30.0`). VeChain Kit uses Chakra v2 internally, and newer v3 releases can break VeChain Kit's button/modal theming.

### Provider chain

`ChakraProvider` → `ColorModeProvider` → `QueryClientProvider` → `VeChainKitProvider` → App

### Contract architecture (monorepo only)

All contracts in the monorepo scaffold are **UUPS upgradeable** using OpenZeppelin's upgradeable contracts and a custom `VeChainProxy.sol` (ERC1967). Key files:

- **`scripts/helpers/upgrades.ts`** — core deploy/upgrade proxy helpers. Copy as-is from the template. All deploy scripts, upgrade scripts, and tests depend on it.
- **`contracts/VeChainProxy.sol`** — ERC1967 proxy contract. Copy as-is.
- **`scripts/deploy/deploy.ts`** — production deployment using `deployProxy` from helpers.
- **`scripts/upgrade/`** — interactive CLI upgrade system with versioned config registry.

For contract architecture, upgrade patterns, storage safety, security, and testing — follow the **`smart-contract-development` skill**. It is the authoritative reference for all Solidity development patterns on VeChain.

### Config package and auto-deployment (monorepo only)

The monorepo uses a `packages/config` package that centralizes contract addresses and network settings per environment. Key mechanics:

- **`local.ts` is git-ignored** — each dev's solo deployment produces different addresses. A mock is auto-generated on first run.
- **`NEXT_PUBLIC_APP_ENV`** controls which config file is loaded (`local`, `testnet`, `mainnet`).
- **`yarn dev`** runs against solo, **`yarn dev:testnet`** against testnet, **`yarn dev:mainnet`** against mainnet.
- **Turbo pipeline** ensures: generate mock config → compile contracts → check/deploy on target network → write addresses to matching config file → start frontend.
- **`checkContractsDeployment.ts`** runs before dev for any environment — if contracts aren't deployed, it deploys them and writes addresses to the correct config file (`local.ts`, `testnet.ts`, or `mainnet.ts`).

### VeChain Kit integration

- `VeChainKitProvider` wraps the app with network config and wallet options
- `WalletButton` from vechain-kit renders the connect/account button
- `useWallet`, `useSendTransaction`, `useCallClause` for wallet/contract interaction
- Refer to the `vechain-kit` skill for advanced patterns (hooks, theming, social login)
- Refer to the `vechain-core` skill for SDK patterns (fee delegation, multi-clause)

## Reference files

Read the matching files BEFORE creating any files. See Critical Rules above.

| Topic | File | Read when... |
|-------|------|-------------|
| Shared source code | [references/shared.md](references/shared.md) | Always — contains all component/provider templates |
| Standalone config | [references/standalone.md](references/standalone.md) | User chose standalone mode (frontend only) |
| Monorepo config | [references/monorepo.md](references/monorepo.md) | User chose monorepo mode (Turbo + contracts) |

## Source: `vechain-ai-skills/skills/create-vechain-dapp/references/monorepo.md`

# Monorepo Templates

Turborepo monorepo with `apps/frontend` (Next.js) and `packages/contracts` (Hardhat + Solidity).
Source files from `shared.md` go under `apps/frontend/src/`.

## Directory structure

```text
{{PROJECT_NAME}}/
├── .env.example
├── .github/workflows/deploy.yml
├── .gitignore
├── .nvmrc
├── Makefile
├── package.json
├── turbo.json
├── apps/
│   └── frontend/
│       ├── .eslintrc.json
│       ├── next.config.js
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── (all shared.md src/ files here)
├── packages/
│   ├── config/
│   │   ├── index.ts
│   │   ├── local.ts              ← git-ignored, auto-generated
│   │   ├── testnet.ts
│   │   ├── mainnet.ts
│   │   ├── package.json
│   │   └── scripts/
│   │       └── generateMockLocalConfig.mjs
│   ├── contracts/
│   │   ├── .gitignore
│   │   ├── docker-compose.yaml
│   │   ├── contracts/
│   │   │   ├── HelloWorld.sol          ← UUPS upgradeable
│   │   │   └── VeChainProxy.sol        ← ERC1967 proxy
│   │   ├── hardhat.config.ts
│   │   ├── package.json
│   │   ├── scripts/
│   │   │   ├── helpers/
│   │   │   │   └── upgrades.ts         ← deploy/upgrade proxy helpers
│   │   │   ├── deploy/
│   │   │   │   └── deploy.ts           ← production deployment
│   │   │   ├── upgrade/
│   │   │   │   ├── select-and-upgrade.ts
│   │   │   │   ├── upgradesConfig.ts
│   │   │   │   └── upgrades/           ← per-contract upgrade scripts
│   │   │   └── checkContractsDeployment.ts
│   │   ├── test/
│   │   │   └── HelloWorld.test.ts
│   │   └── tsconfig.json
│   ├── eslint-config/
│   │   ├── library.js
│   │   ├── next.js
│   │   └── package.json
│   └── typescript-config/
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
```

## Root files

### `package.json`

```json
{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "scripts": {
    "dev": "yarn && dotenv -v NEXT_PUBLIC_APP_ENV=local -e .env -- turbo dev",
    "dev:testnet": "yarn && dotenv -v NEXT_PUBLIC_APP_ENV=testnet -e .env -- turbo dev",
    "dev:mainnet": "yarn && dotenv -v NEXT_PUBLIC_APP_ENV=mainnet -e .env -- turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "contracts:compile": "turbo compile --filter=@{{PROJECT_NAME}}/contracts",
    "contracts:test": "turbo test --filter=@{{PROJECT_NAME}}/contracts",
    "contracts:generate-docs": "turbo generate-docs --filter=@{{PROJECT_NAME}}/contracts",
    "contracts:coverage": "turbo coverage --filter=@{{PROJECT_NAME}}/contracts",
    "contracts:size": "turbo size --filter=@{{PROJECT_NAME}}/contracts",
    "solo-up": "make solo-up",
    "solo-down": "make solo-down",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "dependencies": {
    "turbo": "^2.5.0"
  },
  "devDependencies": {
    "dotenv-cli": "^7.4.0",
    "prettier": "^3.3.0"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "engines": {
    "node": "20.x.x"
  },
  "packageManager": "yarn@1.22.22"
}
```

### `turbo.json`

The turbo pipeline ensures contracts are compiled and deployed before the frontend starts. Each `dev:<env>` variant runs the matching `check-contracts-deployment:<env>` against the correct network.

**Flow:** `dev` → `setup-contracts` → `compile` + `check-contracts-deployment` → `check-or-generate-local-config`

- `check-or-generate-local-config` runs first to ensure `packages/config/local.ts` exists (generates mock if missing)
- `compile` depends on config being available (Hardhat imports config)
- `check-contracts-deployment` runs after compile — checks if contracts are deployed, deploys if not, writes addresses to the matching config file
- `setup-contracts` orchestrates compile + deployment check
- `dev` depends on `setup-contracts` completing
- `dev:testnet` / `dev:mainnet` follow the same flow but target their respective networks

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["NEXT_PUBLIC_APP_ENV", "NEXT_PUBLIC_BASE_PATH", "MNEMONIC"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**", "out/**"]
    },
    "@{{PROJECT_NAME}}/contracts#build": {
      "cache": true,
      "dependsOn": ["@{{PROJECT_NAME}}/config#check-or-generate-local-config"],
      "outputs": ["artifacts/**", "typechain-types/**", "cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^setup-contracts"]
    },
    "dev:testnet": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^setup-contracts:testnet"]
    },
    "dev:mainnet": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^setup-contracts:mainnet"]
    },
    "setup-contracts": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/contracts#check-contracts-deployment"]
    },
    "setup-contracts:testnet": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/contracts#check-contracts-deployment:testnet"]
    },
    "setup-contracts:mainnet": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/contracts#check-contracts-deployment:mainnet"]
    },
    "@{{PROJECT_NAME}}/config#check-or-generate-local-config": {
      "cache": false
    },
    "compile": {
      "cache": true,
      "dependsOn": ["@{{PROJECT_NAME}}/config#check-or-generate-local-config"],
      "outputs": ["artifacts/**", "typechain-types/**", "cache/**"]
    },
    "@{{PROJECT_NAME}}/contracts#check-contracts-deployment": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/config#check-or-generate-local-config"]
    },
    "@{{PROJECT_NAME}}/contracts#check-contracts-deployment:testnet": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/config#check-or-generate-local-config"]
    },
    "@{{PROJECT_NAME}}/contracts#check-contracts-deployment:mainnet": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/config#check-or-generate-local-config"]
    },
    "lint": {
      "cache": false
    },
    "typecheck": {
      "cache": false
    },
    "test": {
      "cache": false,
      "dependsOn": ["^compile", "@{{PROJECT_NAME}}/config#check-or-generate-local-config"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `.gitignore`

```text
node_modules/
.next/
out/
dist/
.env
.env.local
*.tsbuildinfo
next-env.d.ts
artifacts/
cache/
typechain-types/
coverage/

# Auto-generated local config (each dev's solo deployment has different addresses)
packages/config/local.ts
```

### `.nvmrc`

```text
20
```

### `.env.example`

Root env file used by both frontend and contracts. Copy to `.env` before running.

```text
# ---- Wallet ----
# Solo node mnemonic (pre-funded, for local dev only)
MNEMONIC="denial kitchen pet squirrel other broom bar gas better priority spoil cross"

# ---- Frontend ----
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_BASE_PATH=
```

- `MNEMONIC` — used by Hardhat for contract deployment. The default solo mnemonic has pre-funded accounts. For testnet/mainnet, replace with your own.
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` — get one from https://cloud.walletconnect.com
- `NEXT_PUBLIC_BASE_PATH` — set to `/<repo-name>` for GitHub Pages, leave empty for custom domains or local dev.

### `Makefile`

Convenience targets for managing the Thor solo node (requires Docker).

```makefile
SHELL := /bin/bash

help:
    @egrep -h '\s#@\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?#@ "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

# Thor solo
solo-up: #@ Start Thor solo
    docker compose -f packages/contracts/docker-compose.yaml up -d --wait
solo-down: #@ Stop Thor solo
    docker compose -f packages/contracts/docker-compose.yaml down
solo-clean: #@ Clean Thor solo (removes volumes)
    docker compose -f packages/contracts/docker-compose.yaml down -v --remove-orphans
```

- `make solo-up` — start Thor solo in the background, wait until healthy
- `make solo-down` — stop Thor solo
- `make solo-clean` — stop and remove all data (fresh chain next start)

## `apps/frontend/`

### `package.json`

```json
{
  "name": "@{{PROJECT_NAME}}/frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@chakra-ui/react": "3.30.0",
    "@emotion/react": "^11.14.0",
    "@tanstack/react-query": "^5.64.2",
    "@vechain/vechain-kit": "latest",
    "next": "14.2.25",
    "next-themes": "^0.4.6",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^5.5.0"
  },
  "devDependencies": {
    "@{{PROJECT_NAME}}/eslint-config": "*",
    "@{{PROJECT_NAME}}/typescript-config": "*",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.25",
    "typescript": "^5"
  }
}
```

### `next.config.js`

Same as standalone — see `standalone.md`.

```javascript
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

### `tsconfig.json`

```json
{
  "extends": "@{{PROJECT_NAME}}/typescript-config/nextjs.json",
  "compilerOptions": {
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": [".next", "node_modules", "out"]
}
```

### `.eslintrc.json`

```json
{
  "extends": ["@{{PROJECT_NAME}}/eslint-config/next"]
}
```

The frontend reads env vars from the root `.env` file (Turborepo propagates `globalEnv` vars). No separate frontend `.env.example` is needed in monorepo mode.

## `packages/typescript-config/`

### `package.json`

```json
{
  "name": "@{{PROJECT_NAME}}/typescript-config",
  "version": "0.0.0",
  "private": true
}
```

### `base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

### `nextjs.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true
  }
}
```

## `packages/eslint-config/`

### `package.json`

```json
{
  "name": "@{{PROJECT_NAME}}/eslint-config",
  "version": "0.0.0",
  "private": true,
  "files": ["library.js", "next.js"],
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "@vercel/style-guide": "^5.1.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-config-turbo": "^2.5.5",
    "eslint-plugin-only-warn": "^1.1.0",
    "typescript": "^5"
  }
}
```

### `library.js`

```javascript
const { resolve } = require("node:path")
const project = resolve(process.cwd(), "tsconfig.json")

module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["only-warn"],
  globals: { React: true, JSX: true },
  env: { node: true },
  settings: { "import/resolver": { typescript: { project } } },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
}
```

### `next.js`

```javascript
const { resolve } = require("node:path")
const project = resolve(process.cwd(), "tsconfig.json")

module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/next"),
    "plugin:turbo/recommended",
  ],
  globals: { React: true, JSX: true },
  env: { node: true, browser: true },
  plugins: ["only-warn"],
  settings: { "import/resolver": { typescript: { project } } },
  ignorePatterns: [".*.js", "node_modules/"],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
}
```

## `packages/config/`

Central configuration package. Each environment has its own file with contract addresses and network settings.
`local.ts` is git-ignored and auto-generated — each developer's solo deployment produces different addresses.

### How it works

1. `check-or-generate-local-config` (turbo task) runs `generateMockLocalConfig.mjs` — creates `local.ts` with placeholder addresses if it doesn't exist
2. Contracts compile using these placeholder addresses (Hardhat imports `getConfig()`)
3. `check-contracts-deployment` checks if contracts are actually deployed on solo — if not, deploys them and overwrites `local.ts` with real addresses
4. Frontend and tests use `getConfig()` which routes to the correct env file based on `NEXT_PUBLIC_APP_ENV`

### `package.json`

```json
{
  "name": "@{{PROJECT_NAME}}/config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./index.ts",
    "./local": "./local.ts",
    "./testnet": "./testnet.ts",
    "./mainnet": "./mainnet.ts"
  },
  "scripts": {
    "check-or-generate-local-config": "ts-node ./scripts/generateMockLocalConfig.mjs"
  },
  "devDependencies": {
    "ts-node": "^10.9.2"
  }
}
```

### `index.ts`

```typescript
import localConfig from "./local"
import testnetConfig from "./testnet"
import mainnetConfig from "./mainnet"

export type AppConfig = {
  environment: string
  nodeUrl: string
  network: {
    id: string
    name: string
    urls: string[]
    explorerUrl: string
    genesis: {
      id: string
    }
  }
  contracts: {
    helloWorld: string
  }
}

export const AppEnv = {
  LOCAL: "local",
  TESTNET: "testnet",
  MAINNET: "mainnet",
} as const

export type EnvConfig = (typeof AppEnv)[keyof typeof AppEnv]

export const getConfig = (env?: string): AppConfig => {
  const appEnv = env || process.env.NEXT_PUBLIC_APP_ENV
  if (!appEnv) throw new Error("NEXT_PUBLIC_APP_ENV must be set or env must be passed to getConfig()")

  switch (appEnv) {
    case AppEnv.LOCAL:
      return localConfig
    case AppEnv.TESTNET:
      return testnetConfig
    case AppEnv.MAINNET:
      return mainnetConfig
    default:
      throw new Error(`Unsupported NEXT_PUBLIC_APP_ENV: ${appEnv}`)
  }
}
```

### `testnet.ts`

```typescript
import { AppConfig } from "."

const config: AppConfig = {
  environment: "testnet",
  nodeUrl: "https://testnet.vechain.org",
  network: {
    id: "testnet",
    name: "testnet",
    urls: ["https://testnet.vechain.org"],
    explorerUrl: "https://explore-testnet.vechain.org",
    genesis: {
      id: "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127",
    },
  },
  contracts: {
    helloWorld: "", // Deploy and fill in your testnet address
  },
}

export default config
```

### `mainnet.ts`

```typescript
import { AppConfig } from "."

const config: AppConfig = {
  environment: "mainnet",
  nodeUrl: "https://mainnet.vechain.org",
  network: {
    id: "mainnet",
    name: "mainnet",
    urls: ["https://mainnet.vechain.org"],
    explorerUrl: "https://explore.vechain.org",
    genesis: {
      id: "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a",
    },
  },
  contracts: {
    helloWorld: "", // Deploy and fill in your mainnet address
  },
}

export default config
```

### `scripts/generateMockLocalConfig.mjs`

Generates a mock `local.ts` with placeholder addresses so compilation can proceed before contracts are deployed.

```typescript
import fs from "fs"
import path from "path"

export const generateMockLocalConfig = () => {
  console.log("Checking if @{{PROJECT_NAME}}/config/local.ts exists...")
  const localConfigPath = path.resolve("./local.ts")
  if (fs.existsSync(localConfigPath)) {
    console.log(`${localConfigPath} exists, skipping...`)
    return
  }

  console.log(`${localConfigPath} does not exist, generating mock...`)
  const toWrite = `import { AppConfig } from "."
const config: AppConfig = {
  environment: "local",
  nodeUrl: "http://localhost:8669",
  network: {
    id: "solo",
    name: "solo",
    urls: ["http://localhost:8669"],
    explorerUrl: "http://localhost:8669",
    genesis: {
      id: "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6",
    },
  },
  contracts: {
    helloWorld: "0x0000000000000000000000000000000000000000",
  },
}
export default config
`

  console.log(`Writing mock config file to ${localConfigPath}`)
  fs.writeFileSync(localConfigPath, toWrite)
  console.log("Done!")
}

generateMockLocalConfig()
```

## `packages/contracts/`

### `package.json`

```json
{
  "name": "@{{PROJECT_NAME}}/contracts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "build": "hardhat compile",
    "test": "hardhat test --network hardhat",
    "check-contracts-deployment": "hardhat run scripts/checkContractsDeployment.ts --network vechain_solo",
    "check-contracts-deployment:testnet": "hardhat run scripts/checkContractsDeployment.ts --network vechain_testnet",
    "check-contracts-deployment:mainnet": "hardhat run scripts/checkContractsDeployment.ts --network vechain_mainnet",
    "setup-contracts": "echo 'Setup complete'",
    "setup-contracts:testnet": "echo 'Setup complete'",
    "setup-contracts:mainnet": "echo 'Setup complete'",
    "deploy:local": "hardhat run scripts/deploy/deploy.ts --network vechain_solo",
    "deploy:testnet": "hardhat run scripts/deploy/deploy.ts --network vechain_testnet",
    "deploy:mainnet": "hardhat run scripts/deploy/deploy.ts --network vechain_mainnet",
    "upgrade:local": "hardhat run scripts/upgrade/select-and-upgrade.ts --network vechain_solo",
    "upgrade:testnet": "hardhat run scripts/upgrade/select-and-upgrade.ts --network vechain_testnet",
    "upgrade:mainnet": "hardhat run scripts/upgrade/select-and-upgrade.ts --network vechain_mainnet",
    "generate-docs": "hardhat docgen",
    "coverage": "hardhat coverage",
    "size": "hardhat size-contracts",
    "clean": "hardhat clean"
  },
  "dependencies": {
    "@{{PROJECT_NAME}}/config": "*",
    "@openzeppelin/contracts": "5.0.2",
    "@openzeppelin/contracts-upgradeable": "5.0.2",
    "@openzeppelin/upgrades-core": "^1.40.0"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@vechain/sdk-core": "latest",
    "@vechain/sdk-hardhat-plugin": "latest",
    "hardhat": "^2.22.0",
    "hardhat-contract-sizer": "^2.10.0",
    "hardhat-ignore-warnings": "^0.2.12",
    "inquirer": "^9.0.0",
    "solidity-coverage": "^0.8.14",
    "solidity-docgen": "^0.6.0-beta.36",
    "typescript": "^5"
  }
}
```

### `hardhat.config.ts`

```typescript
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@vechain/sdk-hardhat-plugin"
import "hardhat-contract-sizer"
import "hardhat-ignore-warnings"
import "solidity-coverage"
import "solidity-docgen"
import { EnvConfig, getConfig } from "@{{PROJECT_NAME}}/config"
import { HDKey } from "@vechain/sdk-core"

const SOLO_MNEMONIC = "denial kitchen pet squirrel other broom bar gas better priority spoil cross"

const getSoloUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_ENV
    ? getConfig(process.env.NEXT_PUBLIC_APP_ENV as EnvConfig).network.urls[0]
    : "http://localhost:8669"
  return url
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 1 },
          evmVersion: "paris",
        },
      },
    ],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    except: ["mocks", "deprecated", "interfaces", "test", "templates", "openzeppelin", "libraries"],
  },
  mocha: {
    timeout: 1800000,
  },
  gasReporter: {
    enabled: false,
    excludeContracts: ["mocks", "deprecated", "interfaces", "test", "templates"],
  },
  docgen: {
    pages: "files",
  },
  defaultNetwork: process.env.IS_TEST_COVERAGE ? "hardhat" : "vechain_solo",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 20,
        accountsBalance: "1000000000000000000000000",
      },
    },
    vechain_solo: {
      url: getSoloUrl(),
      accounts: {
        mnemonic: process.env.MNEMONIC ?? SOLO_MNEMONIC,
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
        accountsBalance: "1000000000000000000000000",
      },
      gas: 10000000,
    },
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      chainId: 100010,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
      },
      gas: 10000000,
    },
    vechain_mainnet: {
      url: "https://mainnet.vechain.org",
      chainId: 100009,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
        count: 20,
        path: HDKey.VET_DERIVATION_PATH,
      },
      gas: 10000000,
    },
  },
}

export default config
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["hardhat.config.ts", "contracts/**/*.sol", "test/**/*.ts", "scripts/**/*.ts"],
  "exclude": ["node_modules", "dist", "artifacts", "cache"]
}
```

### `contracts/VeChainProxy.sol`

ERC1967 UUPS proxy. Used by the deploy helpers to wrap all upgradeable contracts. Copy as-is.

```solidity
// SPDX-License-Identifier: MIT
// Forked from OpenZeppelin Contracts v5.0.0 (proxy/ERC1967/ERC1967Proxy.sol)
pragma solidity 0.8.20;

import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";
import { ERC1967Utils } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";

/// @dev UUPS-compatible ERC1967 proxy.
/// Constructor deploys the implementation and optionally calls an initializer via delegatecall.
// solc-ignore-next-line missing-receive
contract VeChainProxy is Proxy {
    constructor(address implementation, bytes memory _data) payable {
        ERC1967Utils.upgradeToAndCall(implementation, _data);
    }

    function _implementation() internal view virtual override returns (address) {
        return ERC1967Utils.getImplementation();
    }
}
```

### `contracts/HelloWorld.sol`

UUPS upgradeable starter contract. Follows the pattern from the `smart-contract-development` skill.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract HelloWorld is AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ---------- Storage ------------ //
    struct HelloWorldStorage {
        string greeting;
    }

    // keccak256(abi.encode(uint256(keccak256("storage.HelloWorld")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant HelloWorldStorageLocation =
        0x34a15ab0b3484a5fe3296a09e65efabd0e8e42e7718c06ac9bfe421a06379c00;

    function _getHelloWorldStorage() private pure returns (HelloWorldStorage storage $) {
        assembly {
            $.slot := HelloWorldStorageLocation
        }
    }

    // ---------- Initializer ------------ //
    function initialize(address _upgrader, address _admin) external initializer {
        require(_upgrader != address(0), "HelloWorld: upgrader is the zero address");
        require(_admin != address(0), "HelloWorld: admin is the zero address");

        __UUPSUpgradeable_init();
        __AccessControl_init();

        _grantRole(UPGRADER_ROLE, _upgrader);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);

        HelloWorldStorage storage $ = _getHelloWorldStorage();
        $.greeting = "Hello, VeChain!";
    }

    // ---------- Getters ------------ //
    function greeting() external view returns (string memory) {
        return _getHelloWorldStorage().greeting;
    }

    // ---------- Setters ------------ //
    event GreetingChanged(string newGreeting);

    function setGreeting(string calldata _greeting) external {
        _getHelloWorldStorage().greeting = _greeting;
        emit GreetingChanged(_greeting);
    }

    // ---------- Upgrade ------------ //
    function _authorizeUpgrade(address) internal virtual override onlyRole(UPGRADER_ROLE) {}

    function version() public pure virtual returns (string memory) {
        return "1";
    }
}
```

### `test/HelloWorld.test.ts`

```typescript
import { expect } from "chai"
import { ethers } from "hardhat"
import { deployProxy } from "../scripts/helpers/upgrades"
import { HelloWorld } from "../typechain-types"

describe("HelloWorld", function () {
  let contract: HelloWorld

  beforeEach(async function () {
    const [deployer] = await ethers.getSigners()
    contract = (await deployProxy("HelloWorld", [deployer.address, deployer.address])) as unknown as HelloWorld
  })

  it("should return the initial greeting", async function () {
    expect(await contract.greeting()).to.equal("Hello, VeChain!")
  })

  it("should update the greeting", async function () {
    await contract.setGreeting("Hello, World!")
    expect(await contract.greeting()).to.equal("Hello, World!")
  })

  it("should return version 1", async function () {
    expect(await contract.version()).to.equal("1")
  })
})
```

### `scripts/helpers/upgrades.ts`

Core proxy deployment and upgrade helpers. **Copy this file as-is.** All deploy/upgrade scripts and tests depend on it.

Adapted from the VeBetterDAO production codebase. Provides:
- `deployProxy` — deploy implementation + proxy + initialize in one step
- `deployProxyOnly` — deploy proxy without initialization
- `initializeProxy` — initialize an already-deployed proxy
- `upgradeProxy` — deploy new implementation, call `upgradeToAndCall` on existing proxy
- `deployAndUpgrade` — deploy V1 proxy then sequentially upgrade through multiple versions
- `getInitializerData` — encode `initialize` or `initializeV{N}` call

```typescript
import { BaseContract, Contract, Interface } from "ethers"
import { ethers } from "hardhat"
import { getImplementationAddress } from "@openzeppelin/upgrades-core"

export type DeployUpgradeOptions = {
  versions?: (number | undefined)[]
  libraries?: ({ [libraryName: string]: string } | undefined)[]
  logOutput?: boolean
}

export type UpgradeOptions = {
  version?: number
  libraries?: { [libraryName: string]: string }
  logOutput?: boolean
}

export const deployProxy = async (
  contractName: string,
  args: any[],
  libraries: { [libraryName: string]: string } = {},
  version?: number,
  logOutput: boolean = false,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  logOutput && console.log(`${contractName} impl.: ${await implementation.getAddress()}`)

  const proxyFactory = await ethers.getContractFactory("VeChainProxy")
  const proxy = await proxyFactory.deploy(
    await implementation.getAddress(),
    getInitializerData(Contract.interface, args, version),
  )
  await proxy.waitForDeployment()
  logOutput && console.log(`${contractName} proxy: ${await proxy.getAddress()}`)

  const newImplAddress = await getImplementationAddress(ethers.provider, await proxy.getAddress())
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return Contract.attach(await proxy.getAddress())
}

export const deployProxyOnly = async (
  contractName: string,
  libraries: { [libraryName: string]: string } = {},
  logOutput: boolean = false,
): Promise<string> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  logOutput && console.log(`${contractName} impl.: ${await implementation.getAddress()}`)

  const proxyFactory = await ethers.getContractFactory("VeChainProxy")
  const proxy = await proxyFactory.deploy(await implementation.getAddress(), "0x")
  await proxy.waitForDeployment()
  logOutput && console.log(`${contractName} proxy: ${await proxy.getAddress()}`)

  const newImplAddress = await getImplementationAddress(ethers.provider, await proxy.getAddress())
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return await proxy.getAddress()
}

export const initializeProxy = async (
  proxyAddress: string,
  contractName: string,
  args: any[],
  libraries: { [libraryName: string]: string } = {},
  version?: number,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const initializerData = getInitializerData(Contract.interface, args, version)

  const signer = (await ethers.getSigners())[0]
  const tx = await signer.sendTransaction({
    to: proxyAddress,
    data: initializerData,
    gasLimit: 10_000_000,
  })
  await tx.wait()

  return Contract.attach(proxyAddress)
}

export const upgradeProxy = async (
  previousVersionContractName: string,
  newVersionContractName: string,
  proxyAddress: string,
  args: any[] = [],
  options: UpgradeOptions,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(newVersionContractName, {
    libraries: options.libraries,
  })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  options.logOutput && console.log(`${newVersionContractName} impl.: ${await implementation.getAddress()}`)

  const currentContract = await ethers.getContractAt(previousVersionContractName, proxyAddress)

  const tx = await currentContract.upgradeToAndCall(
    await implementation.getAddress(),
    args.length > 0 ? getInitializerData(Contract.interface, args, options.version) : "0x",
  )
  await tx.wait()

  const newImplAddress = await getImplementationAddress(ethers.provider, proxyAddress)
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return Contract.attach(proxyAddress)
}

export const deployAndUpgrade = async (
  contractNames: string[],
  args: any[][],
  options: DeployUpgradeOptions,
): Promise<BaseContract> => {
  if (contractNames.length === 0) throw new Error("No contracts to deploy")
  if (contractNames.length !== args.length) throw new Error("Contract names and args must have the same length")

  let proxy = await deployProxy(
    contractNames[0],
    args[0],
    options.libraries?.[0],
    options.versions?.[0],
    options.logOutput,
  )

  for (let i = 1; i < contractNames.length; i++) {
    proxy = await upgradeProxy(
      contractNames[i - 1],
      contractNames[i],
      await proxy.getAddress(),
      args[i],
      { version: options.versions?.[i], libraries: options.libraries?.[i], logOutput: options.logOutput },
    )
  }

  return proxy
}

export function getInitializerData(contractInterface: Interface, args: any[], version?: number) {
  const initializer = version ? `initializeV${version}` : "initialize"
  const fragment = contractInterface.getFunction(initializer)
  if (!fragment) throw new Error(`Initializer "${initializer}" not found in contract ABI`)
  return contractInterface.encodeFunctionData(fragment, args)
}
```

### `scripts/deploy/deploy.ts`

Production deployment script. Uses the proxy helpers to deploy all contracts.

```typescript
import { ethers } from "hardhat"
import { deployProxy } from "../helpers/upgrades"
import { getConfig, AppConfig, AppEnv } from "@{{PROJECT_NAME}}/config"
import fs from "fs"
import path from "path"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  const helloWorld = await deployProxy("HelloWorld", [deployer.address, deployer.address], {}, undefined, true)
  const helloWorldAddress = await helloWorld.getAddress()
  console.log("HelloWorld deployed to:", helloWorldAddress)

  // Write addresses to config
  await writeConfig(helloWorldAddress)
}

async function writeConfig(helloWorldAddress: string) {
  const config = getConfig()
  const newConfig: AppConfig = {
    ...config,
    contracts: { helloWorld: helloWorldAddress },
  }

  const toWrite = `import { AppConfig } from "."
const config: AppConfig = ${JSON.stringify(newConfig, null, 2)}
export default config
`

  let fileToWrite: string
  switch (config.environment) {
    case AppEnv.LOCAL:
      fileToWrite = "local.ts"
      break
    case AppEnv.TESTNET:
      fileToWrite = "testnet.ts"
      break
    case AppEnv.MAINNET:
      fileToWrite = "mainnet.ts"
      break
    default:
      throw new Error(`Unsupported env: ${config.environment}`)
  }

  const configPath = path.resolve(__dirname, `../../../config/${fileToWrite}`)
  console.log(`Writing config to ${configPath}`)
  fs.writeFileSync(configPath, toWrite)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

### `scripts/upgrade/upgradesConfig.ts`

Registry of available contract upgrades. Add entries here when creating new versions.

```typescript
export interface UpgradeContract {
  name: string
  configAddressField: string
  versions: readonly string[]
  descriptions: Record<string, string>
}

export const upgradeConfig: Record<string, UpgradeContract> = {
  // Example: uncomment and adapt when you create HelloWorldV2
  // HelloWorld: {
  //   name: "hello-world",
  //   configAddressField: "helloWorld",
  //   versions: ["v2"],
  //   descriptions: {
  //     v2: "Description of what V2 changes",
  //   },
  // },
} as const
```

### `scripts/upgrade/select-and-upgrade.ts`

Interactive CLI for selecting and running upgrades.

```typescript
import inquirer from "inquirer"
import { upgradeConfig } from "./upgradesConfig"
import { getConfig } from "@{{PROJECT_NAME}}/config"
import { ethers, network } from "hardhat"
import { upgradeProxy } from "../helpers/upgrades"

async function main() {
  const env = process.env.NEXT_PUBLIC_APP_ENV
  if (!env) throw new Error("NEXT_PUBLIC_APP_ENV is not set")

  const config = getConfig()

  if (Object.keys(upgradeConfig).length === 0) {
    console.log("No upgrades configured yet. Add entries to upgradesConfig.ts first.")
    process.exit(0)
  }

  const { contract } = await inquirer.prompt<{ contract: keyof typeof upgradeConfig }>({
    type: "list",
    name: "contract",
    message: "Which contract do you want to upgrade?",
    choices: Object.keys(upgradeConfig),
  })

  const selected = upgradeConfig[contract]
  const { version } = await inquirer.prompt<{ version: string }>({
    type: "list",
    name: "version",
    message: `Which version do you want to upgrade ${contract} to?`,
    choices: selected.versions.map((v) => ({
      name: `${v} - ${selected.descriptions[v]}`,
      value: v,
    })),
  })

  const deployer = (await ethers.getSigners())[0]
  const address = (config.contracts as any)[selected.configAddressField]

  console.log(`\nContract: ${selected.name}`)
  console.log(`Address: ${address}`)
  console.log(`Version: ${version}`)
  console.log(`Upgrader: ${deployer.address}`)
  console.log(`Network: ${network.name}\n`)

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
    type: "confirm",
    name: "confirm",
    message: "Proceed with upgrade?",
    default: false,
  })

  if (!confirm) {
    console.log("Upgrade aborted.")
    process.exit(0)
  }

  // The actual upgrade script should be in upgrades/{contract-name}/{contract-name}-{version}.ts
  // Import and run it dynamically, or call upgradeProxy directly:
  const versionNum = parseInt(version.replace("v", ""))
  const previousVersion = versionNum === 2 ? contract : `${contract}V${versionNum - 1}`
  const newVersion = contract // latest version uses the base name

  const upgraded = await upgradeProxy(
    String(previousVersion),
    String(newVersion),
    address,
    [], // reinitializer args - customize per upgrade
    { version: versionNum },
  )

  const newVer = await (upgraded as any).version()
  console.log(`Upgrade complete! New version: ${newVer}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

### `scripts/checkContractsDeployment.ts`

Checks if contracts are deployed on the current network. If not, deploys them via proxy helpers and writes addresses to the matching config file.

```typescript
import { ethers, network } from "hardhat"
import { getConfig, AppConfig, AppEnv } from "@{{PROJECT_NAME}}/config"
import { deployProxy } from "./helpers/upgrades"
import fs from "fs"
import path from "path"

const config = getConfig()
const env = config.environment

async function main() {
  console.log(`Checking contracts deployment on ${network.name} (${config.nodeUrl})...`)

  try {
    const code =
      config.contracts.helloWorld === "" || config.contracts.helloWorld === "0x0000000000000000000000000000000000000000"
        ? "0x"
        : await ethers.provider.getCode(config.contracts.helloWorld)

    if (code === "0x") {
      console.log(`HelloWorld contract not deployed at ${config.contracts.helloWorld}`)
      console.log(`Deploying contracts to ${network.name}...`)

      const [deployer] = await ethers.getSigners()
      const helloWorld = await deployProxy("HelloWorld", [deployer.address, deployer.address], {}, undefined, true)
      const address = await helloWorld.getAddress()

      await overrideConfigWithNewContracts(address)
    } else {
      console.log("Contracts already deployed")
    }
  } catch (e) {
    console.error(e)
  }

  process.exit(0)
}

async function overrideConfigWithNewContracts(helloWorldAddress: string) {
  const newConfig: AppConfig = {
    ...config,
    contracts: { helloWorld: helloWorldAddress },
  }

  const toWrite = `import { AppConfig } from "."
const config: AppConfig = ${JSON.stringify(newConfig, null, 2)}
export default config
`

  let fileToWrite: string
  switch (env) {
    case AppEnv.LOCAL:
      fileToWrite = "local.ts"
      break
    case AppEnv.TESTNET:
      fileToWrite = "testnet.ts"
      break
    case AppEnv.MAINNET:
      fileToWrite = "mainnet.ts"
      break
    default:
      throw new Error(`Unsupported NEXT_PUBLIC_APP_ENV: ${env}`)
  }

  const configPath = path.resolve(__dirname, `../../config/${fileToWrite}`)
  console.log(`Writing new config to ${configPath}`)
  fs.writeFileSync(configPath, toWrite)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

### `.gitignore`

```text
artifacts/
cache/
typechain-types/
node_modules/
coverage/
```

### `docker-compose.yaml`

Thor solo node for local development. Runs on port 8669 with on-demand block production and persistent data.

```yaml
services:
  thor-solo:
    image: ghcr.io/vechain/thor:latest
    hostname: thor-solo
    container_name: thor-solo
    user: root
    environment:
      - DOCKER=1
    entrypoint:
      [
        "/bin/sh",
        "-c",
        "apk update --no-cache && apk add --no-cache curl && thor solo --on-demand --persist --data-dir /data/thor --api-addr 0.0.0.0:8669 --api-cors '*' --verbosity 10",
      ]
    ports:
      - "8669:8669"
    healthcheck:
      test: curl --fail 0.0.0.0:8669/blocks/0 || exit 1
      interval: "2s"
      retries: 30
    volumes:
      - thor-data:/data/thor
    networks:
      - vechain-thor

networks:
  vechain-thor:
    driver: bridge
    name: vechain-thor
volumes:
  thor-data:
    driver: local
    name: thor-data
```

- `--on-demand` — produces blocks only when transactions arrive (faster tests)
- `--persist` — data survives container restarts (use `make solo-clean` to reset)
- Health check ensures `make solo-up` waits until the node is ready before returning

## `.github/workflows/deploy.yml`

Uses `/${{ github.event.repository.name }}` by default for GitHub Pages (`username.github.io/<repo-name>`).
Set to `""` if using a custom domain or if the repo is named `username.github.io`.
Note: `metadata.icons` and raw `<img src>` do NOT auto-prepend `basePath` — prefix them manually.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - "apps/frontend/**"
      - "packages/**"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn

      - run: yarn install --frozen-lockfile

      - run: yarn build
        env:
          NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}"
          NEXT_PUBLIC_NETWORK: "{{NETWORK_TYPE}}"
          NODE_OPTIONS: "--max-old-space-size=4096"

      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/frontend/out

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

## Source: `vechain-ai-skills/skills/create-vechain-dapp/references/shared.md`

# Shared Templates

These files are identical for both standalone and monorepo modes.
In monorepo mode, place them under `apps/frontend/` instead of the project root.

## `.nvmrc`

```text
20
```

## Compatibility notes

### Chakra UI v3 + VeChain Kit

VeChain Kit uses Chakra UI v2 internally. Newer Chakra v3 releases can introduce CSS variable changes that break VeChain Kit's buttons and modals (wrong colors, missing styles). **Pin `@chakra-ui/react` to an exact version known to work** (currently `3.30.0`). Do NOT use `^` ranges.

### Webpack fallbacks

Some VeChain packages import Node.js modules (`fs`, `net`, `tls`) that don't exist in the browser. The `next.config.js` must include webpack fallbacks for client-side builds. See the `next.config.js` template in standalone.md or monorepo.md.

### Static asset paths with basePath

Next.js `basePath` is NOT auto-prepended to `metadata.icons`, `<img src>`, or any raw string paths. Use `process.env.NEXT_PUBLIC_BASE_PATH` prefix for these. The `<Image>` component from `next/image` DOES auto-prepend `basePath`.

## `.env.example`

```text
NEXT_PUBLIC_NETWORK={{NETWORK_TYPE}}
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
```

## `src/app/theme/theme.ts`

```typescript
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  cssVarsPrefix: "app",
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          primary: { value: { _light: "#FFFFFF", _dark: "#0A0A0A" } },
          secondary: { value: { _light: "#F5F5F5", _dark: "#141414" } },
        },
        border: {
          primary: { value: { _light: "{colors.gray.200}", _dark: "{colors.gray.800}" } },
        },
        text: {
          subtle: { value: { _light: "{colors.gray.600}", _dark: "{colors.gray.400}" } },
        },
      },
    },
  },
})

export default createSystem(defaultConfig, config)
```

## `src/components/ui/color-mode.tsx`

```tsx
"use client"

import { Button, ClientOnly, Skeleton, type IconButtonProps } from "@chakra-ui/react"
import { ThemeProvider, useTheme, type ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export type ColorMode = "light" | "dark"
export type ColorModeProviderProps = ThemeProviderProps

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function ColorModeProvider(props: ThemeProviderProps) {
  return <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme ?? resolvedTheme
  return {
    colorMode: (colorMode ?? "light") as ColorMode,
    setColorMode: setTheme,
    toggleColorMode: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "light" ? <LuMoon /> : <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <Button
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          ref={ref}
          {...props}
          css={{ _icon: { width: "4", height: "4" } }}>
          <ColorModeIcon />
        </Button>
      </ClientOnly>
    )
  },
)
```

## `src/components/ui/provider.tsx`

```tsx
"use client"

import { ChakraProvider } from "@chakra-ui/react"
import theme from "@/app/theme/theme"
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
```

## `src/providers/VeChainProvider.tsx`

```tsx
"use client"

import dynamic from "next/dynamic"
import { useColorMode } from "@/components/ui/color-mode"

const VeChainKitProvider = dynamic(
  () => import("@vechain/vechain-kit").then(mod => mod.VeChainKitProvider),
  { ssr: false },
)

interface Props {
  readonly children: React.ReactNode
}

export function VeChainProvider({ children }: Props) {
  const { colorMode } = useColorMode()
  const isDarkMode = colorMode === "dark"
  const networkType = (process.env.NEXT_PUBLIC_NETWORK ?? "test") as "main" | "test"

  return (
    <VeChainKitProvider
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect"],
        walletConnectOptions: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
          ? {
              projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
              metadata: {
                name: "{{PROJECT_TITLE}}",
                description: "{{PROJECT_TITLE}} — VeChain dApp",
                url: typeof window !== "undefined" ? window.location.origin : "",
                icons: [],
              },
            }
          : undefined,
      }}
      loginMethods={[
        { method: "vechain", gridColumn: 4 },
        { method: "dappkit", gridColumn: 4 },
      ]}
      darkMode={isDarkMode}
      language="en"
      network={{ type: networkType }}>
      {children}
    </VeChainKitProvider>
  )
}
```

## `src/api/QueryProvider.ts`

```typescript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})
```

## `src/app/providers.tsx`

```tsx
"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/api/QueryProvider"
import { Provider } from "@/components/ui/provider"
import { VeChainProvider } from "@/providers/VeChainProvider"

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <VeChainProvider>{children}</VeChainProvider>
      </QueryClientProvider>
    </Provider>
  )
}
```

## `src/app/ClientApp.tsx`

```tsx
"use client"

import { Container, Flex, VStack } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Providers } from "./providers"

export function ClientApp({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <VStack minH="100vh" gap={0} align="stretch">
        <Navbar />
        <Flex flex={1}>
          <Container flex={1} my={{ base: 4, md: 10 }} px={4} maxW="breakpoint-xl">
            {children}
          </Container>
        </Flex>
      </VStack>
    </Providers>
  )
}
```

## `src/app/layout.tsx`

```tsx
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Flex, Spinner } from "@chakra-ui/react"

const ClientApp = dynamic(() => import("./ClientApp").then(mod => mod.ClientApp), {
  ssr: false,
  loading: () => (
    <Flex minH="100vh" align="center" justify="center">
      <Spinner size="lg" />
    </Flex>
  ),
})

export const metadata: Metadata = {
  title: "{{PROJECT_TITLE}}",
  description: "{{PROJECT_TITLE}} — a VeChain dApp",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  )
}
```

## `src/app/page.tsx`

```tsx
"use client"

import { Heading, Text, VStack } from "@chakra-ui/react"

export default function HomePage() {
  return (
    <VStack gap={6} py={12} textAlign="center">
      <Heading size="2xl">{"{{PROJECT_TITLE}}"}</Heading>
      <Text textStyle="lg" color="fg.muted">
        {"Built on VeChain with Next.js, Chakra UI, and VeChain Kit"}
      </Text>
    </VStack>
  )
}
```

## `src/components/Navbar.tsx`

Uses `WalletButton` from VeChain Kit (imported directly since the parent
`ClientApp` is already client-only via dynamic import).

```tsx
"use client"

import { Box, Flex, Heading, HStack } from "@chakra-ui/react"
import { WalletButton } from "@vechain/vechain-kit"
import { ColorModeButton } from "@/components/ui/color-mode"

export function Navbar() {
  return (
    <Box as="nav" bg="bg.secondary" px={4} py={3} borderBottomWidth="1px">
      <Flex maxW="breakpoint-xl" mx="auto" align="center" justify="space-between">
        <Heading size="md" fontWeight="bold">
          {"{{PROJECT_TITLE}}"}
        </Heading>
        <HStack gap={2}>
          <ColorModeButton />
          <WalletButton />
        </HStack>
      </Flex>
    </Box>
  )
}
```

## Source: `vechain-ai-skills/skills/create-vechain-dapp/references/standalone.md`

# Standalone Templates

Standalone mode: single Next.js app, no Turborepo, no contracts package.
All source files from `shared.md` go under `src/`.

## Directory structure

```text
{{PROJECT_NAME}}/
├── .github/workflows/deploy.yml
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .nvmrc
├── next.config.js
├── package.json
├── tsconfig.json
└── src/
    ├── api/
    │   └── QueryProvider.ts
    ├── app/
    │   ├── ClientApp.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── providers.tsx
    │   └── theme/
    │       └── theme.ts
    ├── components/
    │   ├── Navbar.tsx
    │   └── ui/
    │       ├── color-mode.tsx
    │       └── provider.tsx
    └── providers/
        └── VeChainProvider.tsx
```

## `package.json`

```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@chakra-ui/react": "3.30.0",
    "@emotion/react": "^11.14.0",
    "@tanstack/react-query": "^5.64.2",
    "@vechain/vechain-kit": "latest",
    "next": "14.2.25",
    "next-themes": "^0.4.6",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^5.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.25",
    "typescript": "^5"
  },
  "engines": {
    "node": "20.x.x"
  },
  "packageManager": "yarn@1.22.22"
}
```

## `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "incremental": true,
    "resolveJsonModule": true,
    "noUncheckedIndexedAccess": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": [".next", "node_modules", "out"]
}
```

## `.eslintrc.json`

```json
{
  "extends": "next/core-web-vitals"
}
```

## `.gitignore`

```text
node_modules/
.next/
out/
.env
.env.local
*.tsbuildinfo
next-env.d.ts
```

## `.github/workflows/deploy.yml`

Uses `/${{ github.event.repository.name }}` by default for GitHub Pages (`username.github.io/<repo-name>`).
Set to `""` if using a custom domain or if the repo is named `username.github.io`.
Note: `metadata.icons` and raw `<img src>` do NOT auto-prepend `basePath` — prefix them manually.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn

      - run: yarn install --frozen-lockfile

      - run: yarn build
        env:
          NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}"
          NEXT_PUBLIC_NETWORK: "{{NETWORK_TYPE}}"

      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

## Source: `vechain-ai-skills/skills/frontend/SKILL.md`

---
name: frontend
description: Generic frontend development patterns for VeChain dApps — React Query, Turborepo architecture, state management, Chakra UI, i18n, loading states, and transaction UX.
allowed-tools: []
license: MIT
metadata:
  author: VeChain
  version: "0.1.0"
---

# Frontend Skill

## CRITICAL RULES

1. **Read reference files FIRST.** When the user's request involves any topic in the reference table below, read those files before doing anything else — before writing code, before making decisions. Briefly mention which files you are reading so the user can confirm the skill is active (e.g., "Reading frontend patterns reference...").
2. **Information priority for VeChain topics:** (a) Reference files in this skill — always the primary source. (b) VeChain MCP tools — use `@vechain/mcp-server` for on-chain data, transaction building, and live network queries; use Kapa AI MCP for VeChain documentation lookups. (c) Web search — only as a last resort, and only for topics NOT covered in the reference files.
3. **Prefer working directly in the main conversation** for VeChain tasks. Plan mode and subagents do not inherit skill context and may fall back to web search instead of using reference files.
4. **After compaction or context loss**, re-read this SKILL.md to restore awareness of the reference table and operating procedure before continuing work.

## Scope

Use this Skill for generic frontend development patterns in VeChain dApps:

- React Query (TanStack Query): query keys, cache invalidation, batch queries, loading states, anti-patterns
- Turborepo monorepo architecture and conventions
- State management (React Query for server state, Zustand for client state)
- Chakra UI integration and responsive design
- i18n with react-i18next
- Transaction UX: loading states, confirmation patterns, error handling
- Choosing between VeChain Kit and dapp-kit

For package-specific APIs (hooks, components, setup), see the **vechain-kit** skill.
For core VeChain SDK, fee delegation, and multi-clause transactions, see the **vechain-core** skill.

## Default stack

| Layer | Default | Alternative |
|-------|---------|-------------|
| Frontend | React / Next.js (App Router) | -- |
| Data fetching | `@tanstack/react-query` | -- |
| State management | Zustand (client state only) | -- |
| UI | Chakra UI v2 | -- |
| Monorepo | Turborepo | -- |
| Node | Node 20 LTS (managed via `nvm`) | -- |

## Operating procedure

### 1. Check Node version

Before installing dependencies or running any command:

- Check if `.nvmrc` exists in the project root. If yes, run `nvm use`.
- If `.nvmrc` does not exist, create one with `20` (Node 20 LTS) and run `nvm use`.

### 2. Detect project structure

- `turbo.json` present → follow Turborepo conventions (`apps/frontend`, `packages/*`)
- Apply conditional patterns (Chakra UI, i18n, Zustand) only when the project uses them

### 3. Clarify before implementing

When the user's request is ambiguous or could be solved multiple ways, **ask before building**. Separate research from implementation.

### 4. Implement with correctness

- Use React Query for all server state (contract reads, indexer data)
- Never duplicate server state in Zustand — let React Query be the source of truth
- Always use `enabled` guards on queries with dynamic params
- Always show skeletons while loading — never render empty/zero states during loads
- Invalidate affected caches after transactions

### 5. Verify and deliver

A task is **not complete** until all applicable gates pass:

1. **Code compiles** — no build errors (`npm run build` or equivalent succeeds)
2. **Tests pass** — existing tests still pass; new logic has test coverage
3. **Risk notes documented** — any signing, fee, or token-transfer implications are called out

## Reference files

Read the matching files BEFORE doing anything else. See Critical Rules above.

| Topic | File | Read when user mentions... |
|-------|------|---------------------------|
| Frontend patterns | [references/frontend.md](references/frontend.md) | frontend, React Query, caching, query keys, loading, skeleton, Turborepo, Chakra, i18n, state management, transaction UX, VeChain Kit vs dapp-kit |

## Source: `vechain-ai-skills/skills/frontend/references/frontend.md`

# Frontend Development Patterns

## When to use

Use when the user asks about: frontend, React, Next.js, React Query, caching, query keys, loading states, skeletons, Turborepo, Chakra UI, i18n, state management, dapp-kit vs VeChain Kit.

## Choosing VeChain Kit vs dapp-kit

| Criteria | VeChain Kit | dapp-kit |
|----------|-------------|----------|
| **Best for** | Full-featured dApps | Lightweight wallet-only |
| **Frameworks** | React, Next.js only | React, Next, Vue, Svelte, Angular |
| **Social login** | Yes (Privy, built-in) | DIY only (complex, see the **vechain-kit** skill) |
| **Pre-built UI** | WalletButton, modals, transaction UI | Minimal (WalletButton only) |
| **Transaction hooks** | useSendTransaction, useTransferVET, useTransferERC20 | useSendTransaction (basic) |
| **Contract read hooks** | useCallClause (React Query-based) | None (use SDK directly) |
| **Token management** | Built-in (balances, swaps, transfers) | Manual |
| **Smart accounts** | Yes (account abstraction) | No |
| **VET domains** | Built-in hooks | Basic |
| **Bundle size** | Larger | Smaller |
| **i18n** | Built-in | No |

**Rule of thumb**: Use VeChain Kit unless bundle size is critical or you need non-React framework support.
See [Should I Use It?](https://docs.vechainkit.vechain.org/discover-vechain-kit/should-i-use-it) for details.

### Quick Start (Template)
```bash
npx create-vechain-dapp@latest
```

Available templates:
| Template | Description |
|----------|-------------|
| **X2Earn** | Monorepo (Turbo) with React frontend, Express.js backend, Hardhat contracts, ChatGPT image recognition, VeBetterDAO integrations |
| **Simple Dapp** | Monorepo (Turbo) with React + Hardhat. Available in VeChain Kit or DAppKit variants |
| **Buy Me Coffee** | Guided tutorial: build a complete dApp with smart contract integration |
| **Smart Contract** | Hardhat-only template for contract development without frontend |

---

## React Query (TanStack Query) Patterns

React Query (`@tanstack/react-query`) is the data-fetching backbone for VeChain frontend projects. VeChain Kit hooks (e.g., `useCallClause`) are built on React Query. Follow these patterns for all data fetching.

### Query Key Structure

Use consistent, hierarchical query keys for caching and invalidation:

```tsx
// Pattern: [scope, entity, ...params]
const queryKey = ['contract', contractAddress, 'balanceOf', address];
const queryKey = ['indexer', 'transactions', { address, page }];
const queryKey = ['token', 'price', 'VET'];
```

VeChain Kit provides `getCallClauseQueryKey` for contract reads:
```tsx
import { getCallClauseQueryKey } from '@vechain/vechain-kit';

const key = getCallClauseQueryKey(CONTRACT_ADDRESS, 'balanceOf', [address]);
```

### Cache Invalidation After Transactions (CRITICAL)

**Every `onTxConfirmed` callback MUST invalidate all queries whose data could have changed.** This is a hard rule, not a suggestion. Stale UI after a successful transaction is a bug -- users see outdated balances, missing navigation items, or phantom banners because queries still hold pre-transaction data.

**Before writing any `useSendTransaction`, ask yourself:**
1. What on-chain state does this transaction change? (e.g., registration status, balances, reward claims)
2. Which queries read that state? (e.g., `useRelayerRegistration`, `useCallClause` for `balanceOf`, custom `useQuery` hooks)
3. Are there UI elements gated on that data? (e.g., navbar items, banners, badges, conditional buttons)

**Invalidate ALL of them in `onTxConfirmed`.**

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { useSendTransaction, useWallet, getCallClauseQueryKey } from '@vechain/vechain-kit';

function StakeButton({ amount }: { amount: string }) {
  const queryClient = useQueryClient();
  const { account } = useWallet();

  const { sendTransaction, status } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
    onTxConfirmed: () => {
      // Invalidate all queries that might be affected
      queryClient.invalidateQueries({
        queryKey: getCallClauseQueryKey(STAKING_CONTRACT, 'stakedBalance', [account?.address]),
      });
      queryClient.invalidateQueries({
        queryKey: getCallClauseQueryKey(TOKEN_CONTRACT, 'balanceOf', [account?.address]),
      });
    },
  });

  // ...
}
```

**Broad invalidation** when many queries could be affected:
```tsx
// Invalidate all queries for a contract
queryClient.invalidateQueries({ queryKey: ['contract', contractAddress] });

// Invalidate everything -- prefer this when the transaction affects
// multiple components across the app (e.g., registration, role changes)
queryClient.invalidateQueries();
```

**Common mistakes:**
- Forgetting to invalidate navbar/sidebar queries after a state change (e.g., registering as a relayer should update the "Manage Relayer" nav link)
- Only invalidating the "primary" query but missing secondary effects (e.g., claiming rewards should also refresh the unclaimed rewards banner, round data, and balance displays)
- Relying on stale static data (e.g., a `report.json`) instead of verifying on-chain state after a write -- always prefer on-chain reads (`useCallClause` / `simulateTransaction`) over cached static files for data that can change via transactions

### Batch Queries with useQueries

When fetching multiple independent values, use `useQueries` to parallelize:

```tsx
import { useQueries } from '@tanstack/react-query';

function PortfolioBalances({ tokens }: { tokens: string[] }) {
  const balanceQueries = useQueries({
    queries: tokens.map((tokenAddress) => ({
      queryKey: ['contract', tokenAddress, 'balanceOf', userAddress],
      queryFn: () => fetchTokenBalance(tokenAddress, userAddress),
      staleTime: 30_000,
    })),
  });

  const isLoading = balanceQueries.some((q) => q.isLoading);
  const balances = balanceQueries.map((q) => q.data);

  if (isLoading) return <BalancesSkeleton />;
  // ...
}
```

### Loading States and Skeletons

Always use `isLoading` to show skeletons. Never render empty/zero states while data is loading:

```tsx
function TokenBalance({ address }: { address: string }) {
  const { data, isLoading } = useCallClause({
    abi: Token__factory.abi,
    address: TOKEN_ADDRESS,
    method: 'balanceOf',
    args: [address],
    queryOptions: { enabled: !!address },
  });

  // GOOD: skeleton while loading
  if (isLoading) return <Skeleton height="20px" width="100px" />;

  // GOOD: render data
  return <Text>{formatBalance(data)}</Text>;
}
```

**Distinguish loading states:**
- `isLoading` -- first load, no cached data yet → show skeleton
- `isRefetching` -- background refresh, cached data available → show data + subtle indicator
- `isFetching` -- any fetch in progress (includes both) → use for disabling actions

### Query Configuration Best Practices

```tsx
// Contract reads: moderate stale time (data changes on-chain after blocks)
useCallClause({
  // ...
  queryOptions: {
    enabled: !!address,        // Don't fetch until params are ready
    staleTime: 10_000,         // 10s = ~1 VeChain block
    refetchInterval: 30_000,   // Poll every 30s for live data
  },
});

// Indexer/API data: longer stale time
useQuery({
  queryKey: ['indexer', 'leaderboard'],
  queryFn: fetchLeaderboard,
  staleTime: 60_000,          // 1 minute
  gcTime: 5 * 60_000,         // Keep in cache 5 minutes
});

// Static data: cache aggressively
useQuery({
  queryKey: ['token', 'info', tokenAddress],
  queryFn: () => fetchTokenInfo(tokenAddress),
  staleTime: Infinity,         // Never refetch automatically
});
```

### Anti-Patterns

```tsx
// BAD: fetching in useEffect + useState (bypasses React Query)
const [balance, setBalance] = useState(null);
useEffect(() => {
  fetchBalance(address).then(setBalance);
}, [address]);

// GOOD: use React Query
const { data: balance } = useCallClause({ ... });

// BAD: duplicating server state in Zustand
const useStore = create((set) => ({
  tokenBalance: null,
  fetchBalance: async () => { ... set({ tokenBalance }) },
}));

// GOOD: React Query owns server state, Zustand owns UI state only

// BAD: missing enabled guard (fires with undefined params)
useCallClause({ method: 'balanceOf', args: [address] }); // address might be undefined!

// GOOD: guard with enabled
useCallClause({ method: 'balanceOf', args: [address], queryOptions: { enabled: !!address } });
```

---

## useThor (not useConnex)

`useConnex` is deprecated everywhere (including dapp-kit v2). Always use `useThor`:

```tsx
// VeChain Kit
import { useThor } from '@vechain/vechain-kit';

// dapp-kit v2
import { useThor } from '@vechain/dapp-kit-react';

const thor = useThor();
```

---

## Common Project Architecture (Turborepo)

Many VeChain dApps use a Turborepo monorepo. When the project follows this structure, respect these conventions:

```
root/
├── apps/
│   └── frontend/          # Next.js App Router
│       └── src/
│           ├── api/
│           │   ├── contracts/  # Contract read hooks (useCallClause wrappers)
│           │   └── indexer/    # Indexer/API query hooks
│           ├── app/            # Next.js App Router pages
│           └── components/
├── packages/
│   ├── contracts/          # Hardhat smart contracts
│   ├── config/             # Shared config (ESLint, TS, etc.)
│   ├── utils/              # Shared utilities
│   └── constants/          # Shared constants, addresses, ABIs
├── turbo.json
└── package.json
```

**Apply these conventions only when the project actually uses this structure.** Check for `turbo.json` or `"turbo"` in the root `package.json` to confirm.

### API Layer Convention
When the project has `src/api/contracts/`:
- Place each contract read hook in its own file (e.g., `useTokenBalance.ts`)
- Export all hooks from `src/api/contracts/index.ts`
- Indexer queries go in `src/api/indexer/`

---

## State Management Pattern

When the project uses React Query + Zustand:
- **Server state** (contract reads, indexer data): React Query via `useCallClause` or custom `useQuery` hooks
- **Client state** (UI state, form state, toggles): Zustand stores
- Never duplicate server state in Zustand -- let React Query be the source of truth

---

## Chakra UI Integration

When the project uses Chakra UI:
- VeChain Kit's peer dependency is `@chakra-ui/react@^2.8.2`
- Define theme in a central file (e.g., `src/app/theme/theme.ts`)
- Use component recipes for consistent styling (button.ts, card.ts, etc.)
- **Mobile-first**: design for small viewports first, add `md`/`lg` breakpoints for larger screens
- Use responsive props: `<Box p={{ base: 4, md: 8 }}>`

---

## i18n with react-i18next

When the project uses internationalization:
- Use `react-i18next` with flat JSON key-value translation files
- Interpolation: `{{variableName}}`
- VeChain Kit has built-in i18n; sync language with `useCurrentLanguage`

```tsx
import { useCurrentLanguage } from '@vechain/vechain-kit';
const { language, setLanguage } = useCurrentLanguage();
```

---

## Transaction UX Checklist

- Disable inputs while a transaction is pending
- Show transaction status via `TransactionModal` or `TransactionToast`
- Provide a transaction ID immediately after signing
- Track confirmation via `useTxReceipt`
- **Invalidate ALL affected React Query caches in `onTxConfirmed`** -- see [Cache Invalidation After Transactions](#cache-invalidation-after-transactions-critical). Think through every query that reads data changed by this transaction, including queries in other components (navbar, banners, badges, lists)
- Show actionable errors:
  - user rejected signing (`UserRejectedError`)
  - transaction reverted (`RevertReasonError` with reason)
  - insufficient VET for transfer
  - insufficient balance for gas fees (VET/VTHO/B3TR)
- Handle fee delegation failures gracefully (fallback or clear error)

## Source: `vechain-ai-skills/skills/smart-contract-development/references/abi-codegen.md`

# ABIs + Client Generation (TypeChain)

## When to use

Use when the user asks about TypeChain, type-safe contract interaction, ABI extraction, code generation, or `@vechain/vechain-contract-types`.

## Rule

Never hand-maintain contract interaction code. Use ABI-driven, code-generated workflow.

## Hardhat + TypeChain Setup

```bash
npm install --save-dev @typechain/hardhat typechain @typechain/ethers-v6
```

```typescript
// hardhat.config.ts
import '@typechain/hardhat';

const config = {
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
};
```

```bash
# Types generated automatically on compile
npx hardhat compile
# Output: typechain-types/
```

## Using Generated Types

```typescript
import { MyToken, MyToken__factory } from '../typechain-types';

// Deploy
const factory = new MyToken__factory(signer);
const token: MyToken = await factory.deploy(1_000_000);

// Read/write with full type safety
const balance: bigint = await token.balanceOf(address);
await token.transfer(recipient, amount);

// Typed event filters
const filter = token.filters.Transfer(from, to);
const events = await token.queryFilter(filter);
```

## Using Types with VeChain Kit (useCallClause)

```typescript
import { useCallClause } from '@vechain/vechain-kit';
import { MyContract__factory } from '../typechain-types';

export const useTokenBalance = (address: string) => {
  return useCallClause({
    abi: MyContract__factory.abi,
    address: CONTRACT_ADDRESS,
    method: 'balanceOf',
    args: [address],
    queryOptions: { enabled: !!address },
  });
};
```

## Pre-built Types: @vechain/vechain-contract-types

**Always install this package** when building VeChain dApps. It provides TypeChain-generated ABIs and factories for all major VeChain ecosystem contracts — no need to hand-write ABIs.

```bash
npm install @vechain/vechain-contract-types
```

### Available contract categories

| Category | Key factories | Use for |
|----------|--------------|---------|
| **Built-in / B32** | `Energy__factory`, `Params__factory`, `Authority__factory`, `Extension__factory`, `Prototype__factory` | VeChainThor built-in contracts (VTHO, chain params) |
| **Smart accounts** | `SocialLoginSmartAccount__factory`, `SocialLoginSmartAccountFactory__factory` | Social login account abstraction |
| **VeBetterDAO** | `B3TR__factory`, `VOT3__factory`, `X2EarnApps__factory`, `X2EarnRewardsPool__factory`, `XAllocationVoting__factory`, `VeBetterPassport__factory`, `GalaxyMember__factory`, `Emissions__factory`, `Treasury__factory`, `VoterRewards__factory` | X2Earn apps, governance, rewards |
| **StarGate** | `Stargate__factory`, `StargateNFT__factory`, `IProtocolStaker__factory` | VET staking, node management |
| **VeVote** | `VeVote__factory` | Governance proposals and voting |
| **VET domains** | `VetDomainsRegistry__factory`, `VetDomainsPublicResolver__factory`, `VetDomainsResolveUtilities__factory` | .vet domain resolution |
| **DEX** | `UniswapV2Factory__factory`, `UniswapV2Pair__factory`, `UniswapV2Router02__factory` | DEX interactions |
| **Tokens** | `Vip180Mintable__factory`, `Vip181Mintable_v7__factory` | Standard VIP-180/VIP-181 tokens |

### Usage with useCallClause

```typescript
import { useCallClause } from '@vechain/vechain-kit';
import { B3TR__factory } from '@vechain/vechain-contract-types';

export const useB3trBalance = (address: string) => {
  return useCallClause({
    abi: B3TR__factory.abi,
    address: B3TR_CONTRACT_ADDRESS,
    method: 'balanceOf',
    args: [address],
    queryOptions: { enabled: !!address },
  });
};
```

### Usage with ThorClient

```typescript
import { B3TR__factory } from '@vechain/vechain-contract-types';

const contract = thorClient.contracts.load(contractAddress, B3TR__factory.abi);
```

Do not modify auto-generated files in this package.

## ABI Extraction

Hardhat produces ABI artifacts in `artifacts/contracts/`:

```typescript
import MyTokenArtifact from '../artifacts/contracts/MyToken.sol/MyToken.json';
const abi = MyTokenArtifact.abi;
const bytecode = MyTokenArtifact.bytecode;
```

For SDK contract interaction patterns using raw ABIs, see [smart-contracts.md](smart-contracts.md).

## Guardrails

- TypeChain output should be in `.gitignore` (generated on compile)
- If consumers need pre-built types, publish the package or check in generated files
- Always regenerate after contract changes (`npx hardhat compile`)
- Do NOT copy-paste ABI arrays into application code manually
- Do NOT write manual TypeScript interfaces for contract methods
- Do NOT use `any` types when TypeChain is available

## Source: `vechain-ai-skills/skills/vechain-core/SKILL.md`

---
name: vechain-core
description: Core VeChain development — SDK usage, fee delegation (VIP-191), multi-clause transactions, dual-token model, legacy migration, and general VeChainThor development patterns.
allowed-tools: []
license: MIT
metadata:
  author: VeChain
  version: "0.4.0"
---

# VeChain Core Skill

## CRITICAL RULES

1. **Read reference files FIRST.** When the user's request involves any topic in the reference table below, read those files before doing anything else — before writing code, before making decisions. Briefly mention which files you are reading so the user can confirm the skill is active (e.g., "Reading fee delegation reference...").
2. **Information priority for VeChain topics:** (a) Reference files in this skill — always the primary source. (b) VeChain MCP tools — use `@vechain/mcp-server` for on-chain data, transaction building, and live network queries; use Kapa AI MCP for VeChain documentation lookups. (c) Web search — only as a last resort, and only for topics NOT covered in the reference files.
3. **Prefer working directly in the main conversation** for VeChain tasks. Plan mode and subagents do not inherit skill context and may fall back to web search instead of using reference files.
4. **After compaction or context loss**, re-read this SKILL.md to restore awareness of the reference table and operating procedure before continuing work.

## Scope

Use this Skill for general VeChain development:

- SDK usage (`@vechain/sdk-core`, `@vechain/sdk-network`, ethers adapter)
- Fee delegation (VIP-191) — gasless transactions, backend sponsorship, vechain.energy
- Multi-clause transactions — atomic batching of multiple operations
- Dual-token model (VET for value, VTHO for gas)
- Legacy migration from Connex/thor-devkit to VeChain SDK
- General VeChainThor development patterns and reference links

For specialized topics, see the companion skills:

- **frontend** — Generic frontend patterns: React Query, Turborepo, state management, Chakra UI, i18n, transaction UX
- **vechain-kit** — VeChain Kit and dapp-kit packages: hooks, components, wallet connection, social login
- **smart-contract-development** — Solidity, Hardhat, testing, security, gas optimization
- **vebetterdao** — X2Earn apps, B3TR/VOT3, governance, VeVote
- **stargate** — NFT staking, validators, delegation, VTHO rewards

## Default stack

| Layer | Default | Alternative |
|-------|---------|-------------|
| SDK | `@vechain/sdk-core` + `@vechain/sdk-network` | `@vechain/sdk-ethers-adapter` |
| Node | Node 20 LTS (managed via `nvm`) | -- |

## Operating procedure

### 1. Check Node version

Before installing dependencies or running any command:

- Check if `.nvmrc` exists in the project root. If yes, run `nvm use` to switch to the required version.
- If `.nvmrc` does not exist, create one with `20` (Node 20 LTS) and run `nvm use`.

### 2. Detect project structure

- `turbo.json` present → follow Turborepo conventions (`apps/`, `packages/*`)

### 3. Clarify before implementing

When the user's request is ambiguous or could be solved multiple ways, **ask before building**. Do not silently research alternatives and pick one. Separate research from implementation:

- If the scope is unclear, ask the user to narrow it
- If multiple architectures are viable, present trade-offs and let the user choose
- Only proceed to implementation once the approach is agreed upon

### 4. Implement with VeChain-specific correctness

- Network: always explicit (`mainnet`/`testnet`/`solo`)
- Gas: estimate first, use fee delegation where appropriate
- Transactions: use multi-clause when batching benefits atomicity or UX
- Tokens: VET for value, VTHO for gas (dual-token model)

### 5. Verify and deliver

A task is **not complete** until all applicable gates pass:

1. **Code compiles** — no build errors
2. **Tests pass** — existing tests still pass; new logic has test coverage
3. **Risk notes documented** — any signing, fee, or token-transfer implications are called out

Then provide:

- Files changed + diffs
- Install/build/test commands
- Risk notes for signing, fees, token transfers

## Reference files

Read the matching files BEFORE doing anything else. See Critical Rules above.

| Topic | File | Read when user mentions... |
|-------|------|---------------------------|
| Fee delegation | [references/fee-delegation.md](references/fee-delegation.md) | gasless, sponsored, VIP-191, delegator, vechain.energy |
| Multi-clause | [references/multi-clause-transactions.md](references/multi-clause-transactions.md) | batch, multi-clause, atomic, multiple operations |
| Legacy migration | [references/sdk-migration.md](references/sdk-migration.md) | Connex, thor-devkit, migration, deprecated |
| Reference links | [references/resources.md](references/resources.md) | docs URL, npm link, GitHub repo |

## Source: `vechain-ai-skills/skills/vechain-core/references/fee-delegation.md`

# Fee Delegation (VIP-191)

## When to use

Use when the user asks about:
- Gasless transactions (users don't pay VTHO)
- Sponsored transactions, fee abstraction for onboarding
- Meta-transactions on VeChain, VIP-191 designated gas payer
- Generic Delegator, gas estimation, transaction cost

## VIP-191: Designated Gas Payer

- Operates at the **transaction level**
- Flexible: per-transaction sponsorship decisions
- Both sender and sponsor must be online
- Requires `reserved.features = 1` in the transaction body
- Best for: selective sponsorship, promotional campaigns, onboarding flows

## VIP-191 Implementation

### Flow
1. User creates an unsigned transaction with `reserved: { features: 1 }`
2. User sends the unsigned transaction to the gas payer's service
3. Gas payer evaluates whether to sponsor (checks criteria)
4. Gas payer returns their signature
5. User combines both signatures and submits to the blockchain

### Backend: Sign as Both Sender and Gas Payer

```typescript
import {
    Address, Clause, VET, Transaction, HexUInt,
    Mnemonic, networkInfo
} from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';

const thorClient = ThorClient.at('http://localhost:8669');

// Build clauses
const clauses = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    )
];

// Estimate gas
const gasResult = await thorClient.gas.estimateGas(clauses, senderAddress);

// Get current block for blockRef
const bestBlock = await thorClient.blocks.getBestBlockCompressed();

// Build transaction body with fee delegation enabled
const body = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: bestBlock.id.slice(0, 18),
    expiration: 32,
    clauses,
    gasPriceCoef: 0,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: Date.now(),
    reserved: {
        features: 1  // Enable VIP-191 fee delegation
    }
};

// Sign with both sender and gas payer private keys
const signedTransaction = Transaction.of(body).signAsSenderAndGasPayer(
    HexUInt.of(senderPrivateKey).bytes,
    HexUInt.of(gasPayerPrivateKey).bytes
);

// Send
const rawTx = HexUInt.of(signedTransaction.encoded).toString();
const result = await thorClient.transactions.sendRawTransaction(rawTx);
const receipt = await thorClient.transactions.waitForTransaction(result.id);
```

### Using a Delegation URL (sponsor service)

```typescript
import { VeChainProvider, ProviderInternalBaseWallet } from '@vechain/sdk-network';

const provider = new VeChainProvider(
    thorClient,
    new ProviderInternalBaseWallet(
        [{ privateKey: senderPrivateKey, address: senderAddress }],
        {
            gasPayer: {
                delegateUrl: 'https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID'
            }
        }
    ),
    true  // isDelegated = true
);

// Transactions sent via this provider are automatically fee-delegated
const signer = await provider.getSigner(senderAddress);
```

### Frontend: Fee Delegation via VeChain Kit

VeChain Kit v2 has two fee delegation modes:

#### 1. Generic Delegator (default -- no cost to app owner)

VeChain Kit auto-enables the Generic Delegator when social login (Privy) or VeChain/ecosystem login is detected. **No configuration needed** -- users pay their own gas fees using VET, VTHO, or B3TR tokens. The app owner pays nothing.

Default gas token priority: VET → B3TR → VTHO. Users can change this in the VeChain Kit settings UI.

#### 2. App-Sponsored Delegation (app owner pays VTHO)

To sponsor transactions yourself, configure a `delegatorUrl`:

```tsx
<VeChainKitProvider
  feeDelegation={{
    delegatorUrl: 'https://your-delegator.com/delegate',
    delegateAllTransactions: true, // true = all users, false = social login only
  }}
>
```

#### Per-Transaction Sponsorship Control

Override delegation on individual transactions via the `delegationUrl` parameter:

```tsx
const { sendTransaction } = useSendTransaction({
  signerAccountAddress: account?.address ?? '',
});

// Sponsor this specific transaction
await sendTransaction(clauses, 'https://your-delegator.com/delegate');

// Or let the user pay (Generic Delegator)
await sendTransaction(clauses);
```

#### Gas Estimation (Generic Delegator)

When using the Generic Delegator, show users what they'll pay before confirming:

```tsx
import { useGenericDelegatorFeeEstimation } from '@vechain/vechain-kit';

const { data: estimation } = useGenericDelegatorFeeEstimation({
  clauses,
  tokens: ['VET', 'B3TR', 'VTHO'],  // Priority order
});
// estimation: { estimatedGas, transactionCost, serviceFee, totalGasUsed, usedToken }
```

#### Transaction Fee UX (Generic Delegator)

When using the Generic Delegator, implement these alerts:
- **Transaction confirmation**: Show the exact amount of VET/VTHO/B3TR that will be deducted
- **Insufficient funds**: Alert if the user lacks balance to cover fees, with the required amount

See the **vechain-kit** skill (`references/kit-hooks.md`) for the full `useSendTransaction` API.

### Frontend: Fee Delegation via dapp-kit

If using dapp-kit instead of VeChain Kit, configure delegation at the provider level:

```tsx
<DAppKitProvider
  nodeUrl="https://testnet.vechain.org"
  genesis="test"
  usePersistence={true}
>
```

Then use `useSendTransaction` from dapp-kit with a delegation URL:
```tsx
import { useSendTransaction } from '@vechain/dapp-kit-react';

function DelegatedTransaction() {
  const { sendTransaction } = useSendTransaction();

  const handleSend = async () => {
    const result = await sendTransaction({
      clauses: [{ to: '0x...', value: '0x0', data: encodedCallData }],
      comment: 'This transaction is sponsored',
      delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID',
    });

    console.log('Transaction ID:', result.id);
  };

  return <button onClick={handleSend}>Send (Gasless)</button>;
}
```

### Hardhat Configuration with Fee Delegation

```typescript
// hardhat.config.ts
vechain_testnet_delegated: {
  url: 'https://testnet.vechain.org',
  accounts: {
    mnemonic: process.env.MNEMONIC || '',
    count: 3,
    path: VET_DERIVATION_PATH
  },
  delegate: {
    url: 'https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID'
  },
  gas: 'auto',
  gasPrice: 'auto'
}
```

## Building a Gas Payer Service

For production VIP-191 deployments, build a service that:

1. **Receives** unsigned transactions from users
2. **Validates** the transaction (whitelist contracts, check amounts, rate limit)
3. **Signs** as gas payer if approved
4. **Returns** the gas payer signature

### Example validation logic
```typescript
function shouldSponsor(tx: TransactionBody): boolean {
  // Only sponsor interactions with known contracts
  const allowedContracts = ['0x...', '0x...'];

  for (const clause of tx.clauses) {
    if (!allowedContracts.includes(clause.to?.toLowerCase() ?? '')) {
      return false;
    }
    // Don't sponsor VET transfers
    if (BigInt(clause.value) > 0n) {
      return false;
    }
  }

  return true;
}
```

## Fee Delegation with vechain.energy (managed service)

For quick setup without building your own service:

1. Go to [vechain.energy](https://vechain.energy/)
2. Create a sponsorship project
3. Whitelist the smart contract addresses
4. For VeChain Kit smart accounts, whitelist:
   - **Mainnet**: `0xD7B96cAC488fEE053daAf8dF74f306bBc237D3f5`
   - **Testnet**: `0x7C5114ef27a721Df187b32e4eD983BaB813B81Cb`
5. Enable email alerts for low VTHO balance
6. Use the generated delegation URL in your provider config

## UX and Security Checklist

**App-sponsored delegation:**
- Always show the user that their transaction is sponsored (no hidden fees)
- Rate-limit sponsorship to prevent abuse
- Whitelist contracts and functions eligible for sponsorship
- Monitor VTHO balance of the gas payer account
- Set reasonable gas limits to prevent griefing
- Log all sponsored transactions for auditing
- Handle delegation service downtime gracefully

**Generic Delegator (user-paid):**
- Show transaction cost estimate before confirmation (use `useGenericDelegatorFeeEstimation`)
- Alert users when they have insufficient balance for fees
- Sponsoring transactions via app-sponsored delegation is still recommended to improve UX

## Source: `vechain-ai-skills/skills/vechain-core/references/multi-clause-transactions.md`

# Multi-Clause Transactions

## When to use

Use when the user asks about:

- Batching multiple operations in one transaction
- Atomic multi-step operations
- Sending to multiple recipients at once
- Combining contract calls with value transfers
- Multi-clause transaction patterns

## What are Multi-Clause Transactions?

Multi-clause transactions are a **unique VeChainThor feature** that allows a single transaction to contain multiple operations (clauses). Each clause has its own recipient, value, and data.

### Key Properties

- **Atomic execution**: All clauses succeed or all fail -- no partial execution
- **Sequential processing**: Clauses execute in the exact order defined
- **Single gas fee**: One transaction fee covers all clauses
- **Single signature**: The sender signs once for all operations

### Clause Structure

Each clause contains:
- `to` -- Recipient address (`null` for contract deployment)
- `value` -- Amount of VET to transfer (in wei)
- `data` -- Input data (for contract calls, `'0x'` for simple transfers)

## Basic Multi-Clause Examples

### Multiple VET Transfers

```typescript
import { Address, Clause, VET, Transaction, HexUInt } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';

const thorClient = ThorClient.at('http://localhost:8669');

const clauses = [
    Clause.transferVET(Address.of('0xRecipient1...'), VET.of(100)),
    Clause.transferVET(Address.of('0xRecipient2...'), VET.of(200)),
    Clause.transferVET(Address.of('0xRecipient3...'), VET.of(300)),
];

const gasResult = await thorClient.gas.estimateGas(clauses, senderAddress);
const bestBlock = await thorClient.blocks.getBestBlockCompressed();

const body = {
    chainTag: 0x27, // testnet
    blockRef: bestBlock.id.slice(0, 18),
    expiration: 32,
    clauses,
    gasPriceCoef: 0,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: Date.now(),
};

const signedTx = Transaction.of(body).sign(privateKey);
const rawTx = HexUInt.of(signedTx.encoded).toString();
const result = await thorClient.transactions.sendRawTransaction(rawTx);
```

### Mixed VET and VTHO Transfers

```typescript
import { Address, Clause, VET, VTHO } from '@vechain/sdk-core';

const clauses = [
    // Transfer VET
    Clause.transferVET(
        Address.of('0xRecipient...'),
        VET.of(1000)
    ),
    // Transfer VTHO
    Clause.transferVTHOToken(
        Address.of('0xRecipient...'),
        VTHO.of(500)
    ),
];
```

### Contract Calls with Value Transfer

```typescript
import { Clause, ABIContract } from '@vechain/sdk-core';

const clauses = [
    // First: approve token spending
    {
        to: tokenContractAddress,
        value: '0x0',
        data: ABIContract.encodeFunctionInput(
            tokenABI,
            'approve',
            [spenderAddress, amount]
        ),
    },
    // Second: call contract that uses the approved tokens
    {
        to: dexContractAddress,
        value: '0x0',
        data: ABIContract.encodeFunctionInput(
            dexABI,
            'swap',
            [tokenAddress, amount, minOutput]
        ),
    },
];
```

## Multi-Clause Reads (Batch Queries)

Read multiple contract values in a single RPC call:

```typescript
const thorClient = ThorClient.at('https://testnet.vechain.org');
const contract = thorClient.contracts.load(contractAddress, contractABI);

// Batch multiple read operations
const results = await thorClient.contracts.executeMultipleClausesCall([
    contract.clause.totalSupply(),
    contract.clause.name(),
    contract.clause.symbol(),
    contract.clause.decimals(),
    contract.clause.balanceOf(someAddress),
]);

const [totalSupply, name, symbol, decimals, balance] = results;
```

## Frontend Multi-Clause with VeChain Kit (preferred)

Pass an array of clauses to `useSendTransaction` (see the **vechain-kit** skill for the full hook API):

```tsx
const { sendTransaction } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
});

const handleBatch = async () => {
    await sendTransaction([
        { to: '0xRecipient1...', value: '0x' + (100e18).toString(16), data: '0x', comment: 'Send 100 VET' },
        { to: contractAddress, value: '0x0', data: encodedFunctionData, comment: 'Contract call', abi: contractFunctionABI },
        { to: '0xRecipient2...', value: '0x' + (50e18).toString(16), data: '0x', comment: 'Send 50 VET' },
    ]);
};
```

Handles both wallet and social login users automatically. Social login V3 smart accounts use `executeBatchWithAuthorization` under the hood.

## Frontend Multi-Clause with dapp-kit

If using dapp-kit instead of VeChain Kit:

```tsx
import { useSendTransaction } from '@vechain/dapp-kit-react';

function BatchOperation() {
    const { sendTransaction } = useSendTransaction();

    const handleBatch = async () => {
        const result = await sendTransaction({
            clauses: [
                { to: '0xRecipient1...', value: '0x' + (100e18).toString(16), data: '0x' },
                { to: contractAddress, value: '0x0', data: encodedFunctionData },
                { to: '0xRecipient2...', value: '0x' + (50e18).toString(16), data: '0x' },
            ],
            comment: 'Batch: transfer + contract call + transfer',
        });

        console.log('Transaction ID:', result.id);
    };

    return <button onClick={handleBatch}>Execute Batch</button>;
}
```

## Use Cases

### Token Airdrop
```typescript
const recipients = [
    { address: '0xAddr1...', amount: 100 },
    { address: '0xAddr2...', amount: 200 },
    { address: '0xAddr3...', amount: 150 },
];

const clauses = recipients.map(r => ({
    to: tokenContractAddress,
    value: '0x0',
    data: ABIContract.encodeFunctionInput(
        erc20ABI,
        'transfer',
        [r.address, ethers.parseEther(r.amount.toString())]
    ),
}));
```

### Approve + Deposit (DeFi Pattern)
```typescript
const clauses = [
    // Step 1: Approve vault to spend tokens
    {
        to: tokenAddress,
        value: '0x0',
        data: ABIContract.encodeFunctionInput(
            erc20ABI, 'approve', [vaultAddress, depositAmount]
        ),
    },
    // Step 2: Deposit into vault (uses approved tokens)
    {
        to: vaultAddress,
        value: '0x0',
        data: ABIContract.encodeFunctionInput(
            vaultABI, 'deposit', [depositAmount]
        ),
    },
];
```

### NFT Batch Mint
```typescript
const tokenURIs = ['ipfs://...1', 'ipfs://...2', 'ipfs://...3'];

const clauses = tokenURIs.map(uri => ({
    to: nftContractAddress,
    value: '0x0',
    data: ABIContract.encodeFunctionInput(
        nftABI, 'safeMint', [recipientAddress, uri]
    ),
}));
```

### Contract Deployment + Initialization
```typescript
const clauses = [
    // Deploy contract
    Clause.deployContract(contractBytecode),
    // Note: You cannot reference the deployed address in subsequent clauses
    // because the address is only known after execution.
    // For deploy + init, use a factory pattern instead.
];
```

## Gas Calculation

Multi-clause transactions follow VeChain's gas formula:

```
g_total = g_0 + SUM(g_type_i + g_data_i + g_vm_i)
```

Where:
- `g_0 = 5,000` (base transaction gas, paid once)
- `g_type = 16,000` per transfer clause; `48,000` per contract creation clause
- `g_data` = per-clause data cost
- `g_vm` = per-clause VM execution cost

### Estimating Gas
```typescript
const gasResult = await thorClient.gas.estimateGas(
    clauses,
    senderAddress,
    { gasPadding: 0.15 } // 15% safety margin
);

console.log('Total gas:', gasResult.totalGas);
console.log('Reverted clauses:', gasResult.revertReasons);
```

## Limitations and Gotchas

- **No cross-clause references**: A clause cannot reference the output (e.g., deployed contract address) of a previous clause
- **All-or-nothing**: If any clause reverts, the entire transaction reverts
- **Gas estimation**: Estimate gas for all clauses together, not individually
- **Receipt format**: The transaction receipt contains an `outputs` array with one entry per clause
- **Event ordering**: Events from clause N appear before events from clause N+1 in the receipt

## Receipt Handling

```typescript
const receipt = await thorClient.transactions.getTransactionReceipt(txId);

// Each clause has its own output in the receipt
for (let i = 0; i < receipt.outputs.length; i++) {
    const output = receipt.outputs[i];
    console.log(`Clause ${i}:`);
    console.log('  Events:', output.events.length);
    console.log('  Transfers:', output.transfers.length);
}

// Check if transaction reverted
if (receipt.reverted) {
    const reason = await thorClient.transactions.getRevertReason(txId);
    console.log('Revert reason:', reason);
}
```

## Best Practices

- Use multi-clause for logically related operations that should be atomic
- Estimate gas for the complete clause set, not individual clauses
- Keep clause count reasonable (excessive clauses increase gas cost)
- Combine with fee delegation for the best user experience
- Use multi-clause reads for efficient batch data fetching
- Handle the all-or-nothing nature in UI (inform users all operations are atomic)

## Source: `vechain-ai-skills/skills/vechain-core/references/resources.md`

# Curated Resources (Source-of-Truth First)

## MCP Server (Live AI-Powered Docs + Blockchain Data)

The VeChain MCP server gives Claude Code direct access to VeChain documentation search, blockchain queries, token data, VeBetterDAO stats, and StarGate staking info -- all without leaving the editor.

### Setup (Claude Code)

Add to `~/.claude/mcp.json`:
```json
{
  "mcpServers": {
    "vechain": {
      "command": "npx",
      "args": ["-y", "@vechain/mcp-server@latest"],
      "env": {
        "VECHAIN_NETWORK": "mainnet"
      }
    }
  }
}
```

Set `VECHAIN_NETWORK` to `mainnet`, `testnet`, or `solo`. Restart Claude Code after adding.

### Available Tools (26)

| Category | Tools |
|----------|-------|
| **Docs search** | `searchDocsVechain`, `searchDocsVechainKit`, `searchDocsVebetterDao`, `searchDocsVevote`, `searchDocsStargate` |
| **Blockchain** | `thorGetBlock`, `thorGetTransaction`, `thorGetAccount`, `thorDecodeEvent` |
| **Tokens/NFTs** | `getTokenBalances`, `getTokenFiatPrice`, `getTokenRegistry`, `getNFTs`, `getNFTContracts` |
| **VeBetterDAO** | `getB3TRGlobalOverview`, `getB3TRAppsLeaderboard`, `getB3TRProposalsResults`, `getB3TRProposalComments`, `getCurrentRound`, `getGMNFTStatus` |
| **Staking** | `getStargateTotalVetStaked`, `getStargateTokenRewards`, `getValidators` |
| **History** | `getTransactions`, `getTransfersOfAccount`, `getHistoryOfAccount` |

- [@vechain/mcp-server npm](https://www.npmjs.com/package/@vechain/mcp-server)
- [VeChain MCP Server GitHub](https://github.com/vechain/vechain-mcp-server)

### Kapa.ai Docs MCP (alternative, docs-only)

For docs-only queries via Kapa.ai's hosted infrastructure:
```bash
claude mcp add --transport http vechain-docs https://vechain.mcp.kapa.ai
```

---

## Core VeChain Documentation
- [VeChain Documentation](https://docs.vechain.org/) (Core concepts, SDKs, tutorials)
- [VeChain Whitepaper](https://www.vechain.org/whitepaper/)
- [VeChainThor Transaction Model](https://docs.vechain.org/core-concepts/transactions/transaction-model)
- [Dual-Token Economic Model](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model)

## VeChain Kit (preferred for React/Next.js dApps)
- [VeChain Kit Documentation](https://docs.vechainkit.vechain.org/)
- [Should I Use It?](https://docs.vechainkit.vechain.org/discover-vechain-kit/should-i-use-it) (decision framework)
- [Installation](https://docs.vechainkit.vechain.org/quickstart/installation)
- [Provider Configuration](https://docs.vechainkit.vechain.org/quickstart/provider-configuration)
- [Send Transactions](https://docs.vechainkit.vechain.org/quickstart/send-transactions)
- [Hooks Reference](https://docs.vechainkit.vechain.org/hooks)
- [Components Reference](https://docs.vechainkit.vechain.org/components)
- [Social Login / Privy Setup](https://docs.vechainkit.vechain.org/quickstart/setup-privy-optional)
- [Smart Accounts](https://docs.vechainkit.vechain.org/social-login/smart-accounts)
- [Fee Delegation Setup](https://docs.vechainkit.vechain.org/fee-delegation/fee-delegation-setup)
- [Theming](https://docs.vechainkit.vechain.org/customization/theming)
- [@vechain/vechain-kit npm](https://www.npmjs.com/package/@vechain/vechain-kit)

### VeChain Kit Docs MCP Server

The VeChain Kit documentation site exposes a GitBook-powered MCP server for AI tools. It provides read-only search and retrieval of the latest published docs — useful for looking up hooks, components, configuration, and social login details directly from your AI editor.

**Endpoint:** `https://docs.vechainkit.vechain.org/~gitbook/mcp`

**Transport:** HTTP only (no stdio or SSE).

**Claude Code setup:**
```bash
claude mcp add --transport http vechain-kit-docs https://docs.vechainkit.vechain.org/~gitbook/mcp
```

**Cursor / VS Code (`mcp.json`):**
```json
{
  "servers": {
    "vechain-kit-docs": {
      "url": "https://docs.vechainkit.vechain.org/~gitbook/mcp"
    }
  }
}
```

This complements the `@vechain/mcp-server` (which provides blockchain data + multi-site docs search) with direct, always-up-to-date access to the VeChain Kit documentation specifically.

## Smart Accounts (Account Abstraction)
- [Smart Accounts GitHub](https://github.com/vechain/smart-accounts) (official SimpleAccount + SimpleAccountFactory)
- [Smart Accounts Documentation](https://docs.vechainkit.vechain.org/social-login/smart-accounts)
- [DIY Social Login Tutorial (dapp-kit + Privy)](https://docs.vechain.org/developer-resources/example-dapps/pwa-with-privy-and-account-abstraction) (complex, VeChain Kit recommended instead)
- [DIY Tutorial Example Repo](https://github.com/vechain-energy/docs-pwa-privy-account-abstraction-my-pwa-project)

## Scaffolding
- [create-vechain-dapp](https://www.npmjs.com/package/create-vechain-dapp) (`npx create-vechain-dapp@latest`)
- [create-vechain-dapp GitHub](https://github.com/vechain/create-vechain-dapp) (templates: X2Earn, Simple Dapp, Buy Me Coffee, Smart Contract)

## VeChain SDK
- [VeChain SDK GitHub](https://github.com/vechain/vechain-sdk-js)
- [@vechain/sdk-core npm](https://www.npmjs.com/package/@vechain/sdk-core) (offline: transactions, signing, encoding)
- [@vechain/sdk-network npm](https://www.npmjs.com/package/@vechain/sdk-network) (network: ThorClient, providers, contracts)
- [@vechain/sdk-errors npm](https://www.npmjs.com/package/@vechain/sdk-errors)
- [@vechain/vechain-contract-types npm](https://www.npmjs.com/package/@vechain/vechain-contract-types) (pre-built TypeChain types for VeChain ecosystem contracts)
- [@vechain/contract-getters npm](https://www.npmjs.com/package/@vechain/contract-getters) (framework-agnostic read-only getters: balances, VNS, avatars, smart accounts)
- [SDK Accounts Guide](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk/accounts)
- [SDK Transactions Guide](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk/transactions)
- [SDK Contracts Guide](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk/contracts)
- [SDK ThorClient Guide](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk/thor-client)

## DApp Kit (lightweight alternative)
- [DApp Kit Documentation](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)
- [@vechain/dapp-kit-react npm](https://www.npmjs.com/package/@vechain/dapp-kit-react)
- [DApp Kit React Usage](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit/dapp-kit-1/react/usage)

## Wallets
- [VeWorld Wallet](https://www.veworld.net/) (official wallet -- browser extension + mobile)
- [VeWorld Documentation](https://docs.vechain.org/core-concepts/wallets/veworld)

## Smart Contract Development

### Hardhat Integration
- [Build with Hardhat Guide](https://docs.vechain.org/developer-resources/how-to-build-on-vechain/build-with-hardhat)
- [Hardhat Plugin Documentation](https://docs.vechain.org/developer-resources/frameworks-and-ides/hardhat)
- [@vechain/sdk-hardhat-plugin npm](https://www.npmjs.com/package/@vechain/sdk-hardhat-plugin)

### OpenZeppelin
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/) (contract generator)

### Solidity
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Solidity by Example](https://solidity-by-example.org/)

## Local Development
- [Thor Solo Node Guide](https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node)
- [Thor Node GitHub](https://github.com/vechain/thor)
- [Docker Hub: vechain/thor](https://hub.docker.com/r/vechain/thor)

## VeChain-Specific Features

### Fee Delegation
- [Fee Delegation Overview](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/fee-delegation)
- [VIP-191 Integration Guide](https://docs.vechain.org/developer-resources/vip-191-designated-gas-payer/how-to-integrate-vip-191-i)
- [vechain.energy Managed Delegation](https://vechain.energy/)

### Multi-Clause Transactions
- [Multi-Clause Documentation](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/clauses-multi-task-transaction)

### Token Standards
- [VIP-180 (Fungible Token)](https://github.com/vechain/VIPs/blob/master/vips/VIP-180.md) (ERC-20 compatible, superseded by standard ERC-20)
- [VIP-181 (Non-Fungible Token)](https://github.com/vechain/VIPs/blob/master/vips/VIP-181.md) (ERC-721 compatible, superseded by standard ERC-721)

### VET Domains
- [VET Domains](https://vet.domains/) (.vet domain name service)

## Ethers.js Compatibility
- [@vechain/sdk-ethers-adapter npm](https://www.npmjs.com/package/@vechain/sdk-ethers-adapter)
- [ethers.js Documentation](https://docs.ethers.org/)

## Testing
- [Hardhat Testing Guide](https://hardhat.org/tutorial/testing-contracts)
- [Chai Matchers (Hardhat)](https://hardhat.org/hardhat-chai-matchers/docs/overview)

## Security
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/security)
- [SWC Registry](https://swcregistry.io/) (Smart Contract Weakness Classification)
- [Slither (Static Analyzer)](https://github.com/crytic/slither)

## VeBetterDAO (X2Earn Sustainability Apps)
- [VeBetterDAO Documentation](https://docs.vebetterdao.org/)
- [Developer Guide: Get Started](https://docs.vebetterdao.org/developer-guides/get-started)
- [Reward Distribution](https://docs.vebetterdao.org/developer-guides/reward-distribution)
- [Sustainability Proofs & Impacts](https://docs.vebetterdao.org/developer-guides/sustainability-proof-and-impacts)
- [Submit Your App](https://docs.vebetterdao.org/developer-guides/submit-your-app)
- [Test Environment](https://docs.vebetterdao.org/developer-guides/test-environment)
- [X-App-Template (GitHub)](https://github.com/vechain/x-app-template)
- [VeBetterDAO Contracts (GitHub)](https://github.com/vechain/vebetterdao-contracts)
- [Smart Contract Addresses](https://docs.vebetterdao.org/smart-contracts)

## StarGate (NFT-Based Staking)
- [StarGate Documentation](https://docs.stargate.vechain.org/)
- [Staking Lifecycle](https://docs.stargate.vechain.org/overview/staking-lifecycle)
- [NFT Tiers](https://docs.stargate.vechain.org/overview/nft-tiers)
- [Rewards Structure](https://docs.stargate.vechain.org/overview/rewards-structure)
- [Validators](https://docs.stargate.vechain.org/overview/validators)
- [Developer API](https://docs.stargate.vechain.org/for-developers/api)
- [Contracts](https://docs.stargate.vechain.org/for-developers/contracts)
- [StarGate Contracts (GitHub)](https://github.com/vechain/stargate-contracts)
- [StarGate dApp](https://app.stargate.vechain.org/)

## Governance (VeVote)
- [VeVote Documentation](https://docs.vevote.vechain.org/)
- [VeVote Platform](https://vevote.vechain.org/)
- [VeVote Monorepo (GitHub)](https://github.com/vechain/vevote)
- [VeVote Contracts (GitHub)](https://github.com/vechain/vevote-contracts)
- [VeChain Governance Overview](https://docs.vechain.org/introduction-to-vechain/about-the-vechain-blockchain/governance)

## VeChain Ecosystem
- [VeChain Official Website](https://www.vechain.org/)
- [VeChain GitHub Organization](https://github.com/vechain)
- [VeChain Improvement Proposals (VIPs)](https://github.com/vechain/VIPs)
- [VeChain Explorer (Mainnet)](https://explore.vechain.org/)
- [VeChain Explorer (Testnet)](https://explore-testnet.vechain.org/)

## Network Endpoints

- **Mainnet**: `https://mainnet.vechain.org`
- **Testnet**: `https://testnet.vechain.org`
- **Thor Solo (local)**: `http://localhost:8669`

## Thor REST API (direct HTTP, no SDK needed)

For lightweight reads without the SDK (e.g., serverless functions, scripts):

```bash
# VET balance
GET /accounts/{address}
# → { "balance": "0x...", "energy": "0x...", "hasCode": false }

# Token balance (balanceOf via simulated call)
POST /accounts/*
{
  "clauses": [{ "to": "0xTokenAddress", "value": "0", "data": "0x70a08231000000000000000000000000{address}" }]
}
# → { "results": [{ "data": "0x...", "gasUsed": ... }] }
```

**Common mistake:** Do NOT `POST /accounts/{tokenAddress}` — token reads use `POST /accounts/*` with clauses.

## Token Registry

Public JSON registry of VeChain tokens with metadata and icons:

- **Mainnet**: `https://vechain.github.io/token-registry/main.json`
- **Testnet**: `https://vechain.github.io/token-registry/test.json`
- **Icon URL**: `https://vechain.github.io/token-registry/assets/{icon}` (where `icon` is the hash filename from the JSON)

## VET Domain Resolution

For `.vet` domain lookups outside of React (in React, use VeChain Kit's `useVechainDomain` hook instead):

- **Public API**: `https://vet.domains/api/lookup/name/{domain}` → `{ "addresses": [{ "address": "0x..." }] }`

## App-Hub Submission

To list your dApp in the VeChain ecosystem directory:

1. Fork [vechain/app-hub](https://github.com/vechain/app-hub)
2. Create `apps/{reversed-domain}/` (e.g., `apps/org.myapp/`)
3. Add `manifest.json` + `logo.png` (512x512)
4. PR to the `master` branch

## Source: `vechain-ai-skills/skills/vechain-core/references/sdk-migration.md`

# Connex / Thor DevKit -> SDK Migration

## When to use

Use when the user has Connex, thor-devkit, web3-providers-connex, or @vechain/hardhat-vechain in their project, or asks about migrating from deprecated VeChain packages.

## The rule
- New code: `@vechain/sdk-core` + `@vechain/sdk-network` types and APIs.
- Legacy dependencies: isolate Connex/Thor DevKit usage behind an adapter boundary.

## Background
As of December 31, 2024, VeChain deprecated all legacy developer tools in favor of the unified SDK:

| Deprecated Package | Replacement |
|-------------------|-------------|
| `@vechain/connex` | `@vechain/sdk-network` (ThorClient) |
| `thor-devkit` | `@vechain/sdk-core` |
| `@vechain/hardhat-vechain` | `@vechain/sdk-hardhat-plugin` |
| `web3-providers-connex` | `@vechain/sdk-ethers-adapter` |

## Preferred migration: direct SDK usage

Use `@vechain/sdk-core` and `@vechain/sdk-network` directly:

### Transaction building (was thor-devkit)

```typescript
// OLD (thor-devkit)
import { Transaction, secp256k1 } from 'thor-devkit';
const tx = new Transaction({ chainTag: 0x27, ... });

// NEW (@vechain/sdk-core)
import { Transaction, Clause, Address, VET } from '@vechain/sdk-core';
const clauses = [Clause.transferVET(Address.of('0x...'), VET.of(100))];
const signedTx = Transaction.of({ chainTag: 0x27, clauses, ... }).sign(privateKey);
```

### Network interaction (was Connex)

```typescript
// OLD (Connex)
const connex = new Connex({ node: 'https://testnet.vechain.org', network: 'test' });
const account = await connex.thor.account('0x...').get();

// NEW (@vechain/sdk-network)
import { ThorClient } from '@vechain/sdk-network';
const thorClient = ThorClient.at('https://testnet.vechain.org');
const account = await thorClient.accounts.getAccount('0x...');
```

### Contract interaction (was Connex.Thor)

```typescript
// OLD (Connex)
const method = connex.thor.account(contractAddr).method(abiItem);
const result = await method.call(arg1, arg2);

// NEW (@vechain/sdk-network)
const contract = thorClient.contracts.load(contractAddr, abi);
const result = await contract.read.methodName(arg1, arg2);
```

### Signing transactions (was Connex.Vendor)

```typescript
// OLD (Connex)
const result = await connex.vendor.sign('tx', [clause]).request();

// NEW (with dapp-kit v2 - for frontend)
import { useThor } from '@vechain/dapp-kit-react';
const thor = useThor();
// Use thor for contract reads; use useSendTransaction for writes

// NEW (with SDK - for backend/scripts)
const signedTx = Transaction.of(body).sign(privateKey);
const result = await thorClient.transactions.sendRawTransaction(
  HexUInt.of(signedTx.encoded).toString()
);
```

## Practical boundary layout (when legacy code exists)
Keep these modules separate:

- `src/vechain/sdk/`:
  - all SDK-first code: ThorClient, Clause builders, contract interaction, typed transactions

- `src/vechain/legacy/`:
  - adapters for legacy Connex-based libraries
  - conversions between Connex types and SDK types
  - only at edges where migration is not yet complete

## ethers.js adapter

For projects using ethers.js patterns, use `@vechain/sdk-ethers-adapter`:

```typescript
import { VeChainProvider } from '@vechain/sdk-ethers-adapter';

// Creates an ethers-compatible provider backed by VeChainThor
const provider = new VeChainProvider(thorClient);
```

## Common mistakes to prevent
- Using `useConnex` anywhere (deprecated in both VeChain Kit and dapp-kit v2; use `useThor` instead)
- Mixing Connex `thor` and SDK `ThorClient` in the same module (causes confusion)
- Using deprecated `thor-devkit` for new transaction construction (use `@vechain/sdk-core`)
- Importing `web3-providers-connex` when `@vechain/sdk-ethers-adapter` exists
- Not updating Hardhat plugin (old `@vechain/hardhat-vechain` vs new `@vechain/sdk-hardhat-plugin`)

## Decision checklist
If you're about to add a legacy VeChain dependency:
1) Is there an SDK-native equivalent? Prefer SDK.
2) Is the only reason a legacy library? Isolate it at the boundary.
3) Can you use `@vechain/sdk-ethers-adapter` instead of `web3-providers-connex`? Prefer the adapter.

## Source: `vechain-ai-skills/skills/vechain-kit/SKILL.md`

---
name: vechain-kit
description: VeChain Kit and dapp-kit packages — installation, hooks, components, wallet connection, social login, smart accounts, theming, and Privy setup.
allowed-tools: []
license: MIT
metadata:
  author: VeChain
  version: "0.1.0"
---

# VeChain Kit Skill

## CRITICAL RULES

1. **Read reference files FIRST.** When the user's request involves any topic in the reference table below, read those files before doing anything else — before writing code, before making decisions. Briefly mention which files you are reading so the user can confirm the skill is active (e.g., "Reading VeChain Kit reference...").
2. **Information priority for VeChain topics:** (a) Reference files in this skill — always the primary source. (b) VeChain MCP tools — use `@vechain/mcp-server` for on-chain data, transaction building, and live network queries; use Kapa AI MCP for VeChain documentation lookups. (c) Web search — only as a last resort, and only for topics NOT covered in the reference files.
3. **Prefer working directly in the main conversation** for VeChain tasks. Plan mode and subagents do not inherit skill context and may fall back to web search instead of using reference files.
4. **After compaction or context loss**, re-read this SKILL.md to restore awareness of the reference table and operating procedure before continuing work.

## Scope

Use this Skill for the VeChain Kit and dapp-kit packages specifically:

- VeChain Kit: installation, setup, configuration, Privy integration
- dapp-kit: lightweight wallet connection for non-React or minimal setups
- Wallet connection, social login (email, Google, passkey), smart accounts
- Pre-built UI components (WalletButton, TransactionModal)
- Hooks (useWallet, useSendTransaction, useCallClause, token/domain/oracle hooks)
- Theming and Privy setup
- i18n with react-i18next: bi-directional language sync (Kit ↔ host app), pre-commit/ESLint for missing or unused translation keys

For generic frontend patterns (React Query, Turborepo, state management, Chakra UI, transaction UX), see the **frontend** skill.

## Default stack

| Layer | Default | Alternative |
|-------|---------|-------------|
| Frontend | `@vechain/vechain-kit` | `@vechain/dapp-kit-react` (lightweight/non-React) |
| Node | Node 20 LTS (managed via `nvm`) | -- |

## Operating procedure

### 1. Check Node version

Before installing dependencies or running any command:

- Check if `.nvmrc` exists in the project root. If yes, run `nvm use`.
- If `.nvmrc` does not exist, create one with `20` (Node 20 LTS) and run `nvm use`.

### 2. Detect project structure

- `turbo.json` present → follow Turborepo conventions (`apps/frontend`, `packages/*`)
- Use `useThor` for Thor client access (both VeChain Kit and dapp-kit v2). `useConnex` is deprecated everywhere.
- Apply conditional patterns (Chakra UI, i18n, Zustand) only when the project uses them

### 3. Choose the right library

**When to ask the user:** If the project doesn't already use VeChain Kit or dapp-kit and the user hasn't specified which to use, ask before choosing. Key questions:

- Do you need social login (email, Google, passkey)? → VeChain Kit
- Do you want pre-built UI modals and hooks (WalletButton, TransactionModal, token hooks)? → VeChain Kit
- Do you want a lightweight wallet-only integration with minimal dependencies? → dapp-kit
- Non-React framework? → dapp-kit

### 4. Clarify before implementing

When the user's request is ambiguous or could be solved multiple ways, **ask before building**. Separate research from implementation.

### 5. Implement with VeChain-specific correctness

- Network: always explicit (`mainnet`/`testnet`/`solo`)
- Social login: Generic Delegator auto-enabled (users pay gas in VET/VTHO/B3TR); app-sponsored delegation optional for better UX; smart accounts; pre-fetch data before `sendTransaction`

### 6. Verify and deliver

A task is **not complete** until all applicable gates pass:

1. **Code compiles** — no build errors (`npm run build` or equivalent succeeds)
2. **Tests pass** — existing tests still pass; new logic has test coverage
3. **Risk notes documented** — any signing, fee, or token-transfer implications are called out

## Reference files

Read the matching files BEFORE doing anything else. See Critical Rules above.

| Topic | File | Read when user mentions... |
|-------|------|---------------------------|
| Setup & config | [references/kit-setup.md](references/kit-setup.md) | Installing VeChain Kit, provider setup, CSS framework, Tailwind, env vars, login methods, legal documents, ecosystem apps, common pitfalls |
| Hooks | [references/kit-hooks.md](references/kit-hooks.md) | useWallet, useCallClause, useSendTransaction, useBuildTransaction, useSignMessage, contract reads, transactions, VET domains, NFTs, blockchain hooks, language/currency, @vechain/contract-getters |
| Components & modals | [references/kit-components.md](references/kit-components.md) | WalletButton, TransactionModal, TransactionToast, modal hooks, isolated views |
| Social login | [references/kit-social-login.md](references/kit-social-login.md) | Social login, smart accounts, account abstraction, Privy setup, fee delegation for social login, DIY social login |
| Theming | [references/kit-theming.md](references/kit-theming.md) | Theming, colors, fonts, buttons, glass effects, bottom sheet, Chakra UI compatibility, webpack fallbacks |
| dapp-kit | [references/frontend-dappkit.md](references/frontend-dappkit.md) | dapp-kit, DAppKitProvider, lightweight wallet |
| Translations + Kit | [references/translations-vechain-kit.md](references/translations-vechain-kit.md) | i18n, translations, language sync, VeChain Kit language, missing translations, pre-commit, ESLint, unused keys |

## Source: `vechain-ai-skills/skills/vechain-kit/references/frontend-dappkit.md`

# dapp-kit (Lightweight Alternative)

## When to use

Use when the user asks about: dapp-kit, DAppKitProvider, lightweight wallet connection, non-React VeChain frontend.

See the **frontend** skill for choosing VeChain Kit vs dapp-kit and shared frontend patterns.

## When to Choose dapp-kit Over VeChain Kit

- Bundle size is critical
- Non-React framework (Vue, Svelte, Angular)
- Wallet connection only (no social login, no pre-built transaction UI)
- Minimal dependency footprint

---

## Setup

```bash
npm install @vechain/dapp-kit-react
```

```tsx
import { DAppKitProvider } from '@vechain/dapp-kit-react';

<DAppKitProvider
  nodeUrl="https://testnet.vechain.org/"
  genesis="test"
  usePersistence={true}
  allowedWallets={['veworld', 'wallet-connect']}
>
  <YourApp />
</DAppKitProvider>
```

---

## Available Hooks

| Hook | Description |
|------|-------------|
| `useWallet()` | Connection state, account address, disconnect |
| `useThor()` | Thor client for direct blockchain access |
| `useWalletModal()` | Open/close wallet connection modal |
| `useVechainDomain()` | Resolve .vet domain names |
| `useSendTransaction()` | Send transactions with optional fee delegation |

### useThor

```tsx
import { useThor } from '@vechain/dapp-kit-react';

const thor = useThor();
// Use thor for contract reads, block queries, etc.
```

### useSendTransaction

```tsx
import { useSendTransaction } from '@vechain/dapp-kit-react';

function SendButton() {
  const { sendTransaction } = useSendTransaction();

  const handleSend = async () => {
    const result = await sendTransaction({
      clauses: [
        { to: '0x...', value: '0x0', data: encodedCallData },
      ],
      comment: 'Description for the user',
      // Optional: app-sponsored fee delegation
      delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID',
    });

    console.log('Transaction ID:', result.id);
  };

  return <button onClick={handleSend}>Send</button>;
}
```

### Components

```tsx
import { WalletButton } from '@vechain/dapp-kit-react';

<WalletButton />
```

---

## Limitations vs VeChain Kit

- No social login (Privy) -- DIY only, see the **vechain-kit** skill (`references/kit-social-login.md`)
- No pre-built transaction UI (TransactionModal, TransactionToast)
- No contract read hooks (useCallClause) -- build your own with React Query + `useThor()`
- No token management hooks
- No smart account support
- No i18n

For contract reads without VeChain Kit's `useCallClause`, build custom React Query hooks:

```tsx
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';

export function useTokenBalance(contractAddress: string, userAddress: string) {
  const thor = useThor();

  return useQuery({
    queryKey: ['contract', contractAddress, 'balanceOf', userAddress],
    queryFn: async () => {
      const contract = thor.contracts.load(contractAddress, ERC20_ABI);
      return contract.read.balanceOf(userAddress);
    },
    enabled: !!userAddress && !!thor,
    staleTime: 10_000,
  });
}
```

## Source: `vechain-ai-skills/skills/vechain-kit/references/kit-components.md`

# VeChain Kit — Components & Modals

## When to use

Use when the user asks about: WalletButton, TransactionModal, TransactionToast, modal hooks, isolated views, or VeChain Kit UI components.

---

## WalletButton

Acts as login button when disconnected and account button when connected.

```tsx
import { WalletButton } from '@vechain/vechain-kit';

<WalletButton mobileVariant="icon" desktopVariant="iconAndDomain" />

// Custom styling via buttonStyle (Chakra UI style props)
<WalletButton
  mobileVariant="iconDomainAndAssets"
  desktopVariant="iconDomainAndAssets"
  buttonStyle={{
    background: '#f08098',
    color: 'white',
    border: '2px solid #000',
    _hover: { background: '#db607a' },
  }}
/>
```

Variants: `icon` | `iconAndDomain` | `iconDomainAndAddress` | `iconDomainAndAssets`

Note: some variants adapt based on available data (e.g. `iconDomainAndAssets` only shows assets if the user has any).

## TransactionModal

```tsx
import { TransactionModal, useTransactionModal } from '@vechain/vechain-kit';

const { open, close, isOpen } = useTransactionModal();

<TransactionModal
  isOpen={isOpen}
  onClose={close}
  status={status}
  txReceipt={txReceipt}
  txError={error}
  onTryAgain={handleTryAgain}
  uiConfig={{
    title: 'Confirm Transaction',
    description: 'Sending tokens...',
    showShareOnSocials: true,
    showExplorerButton: true,
    isClosable: true,
  }}
/>
```

## Modal Hooks

All modal hooks return `{ open, close, isOpen }`. Pass `{ isolatedView: true }` to `open()` to prevent the user from navigating to other Kit sections.

```tsx
import {
  useAccountModal, useProfileModal, useSendTokenModal,
  useReceiveModal, useConnectModal, useDAppKitWalletModal,
  useAccountCustomizationModal, useAccessAndSecurityModal,
  useChooseNameModal, useUpgradeSmartAccountModal,
  useWalletModal, useTransactionToast,
  useExploreEcosystemModal, useNotificationsModal, useFAQModal,
} from '@vechain/vechain-kit';

const { open: openProfile } = useProfileModal();
openProfile({ isolatedView: true }); // Prevent navigation to other kit sections

// Wallet-only connection (bypasses social login)
const { open: openWalletModal } = useDAppKitWalletModal();
```

**Account:** `useAccountModal`, `useProfileModal`, `useAccountCustomizationModal`, `useAccessAndSecurityModal`, `useChooseNameModal`, `useUpgradeSmartAccountModal`
**Wallet/Connection:** `useConnectModal`, `useWalletModal`, `useDAppKitWalletModal`
**Transaction:** `useTransactionModal`, `useTransactionToast`, `useSendTokenModal`, `useReceiveModal`
**Features:** `useExploreEcosystemModal`, `useNotificationsModal`, `useFAQModal`

**VeWorld mobile:** When the app is accessed from VeWorld's in-app browser, VeWorld is automatically enforced as the primary authentication method.

## Source: `vechain-ai-skills/skills/vechain-kit/references/kit-hooks.md`

# VeChain Kit — Hooks

## When to use

Use when the user asks about: useWallet, useCallClause, useSendTransaction, useBuildTransaction, useSignMessage, useSignTypedData, contract reads, transactions, VET domains, NFTs, blockchain hooks, language/currency hooks, or @vechain/contract-getters.

---

## General

All hooks use TanStack Query (React Query) and return a consistent shape:
```typescript
{ data, isLoading, isError, error, refetch, isRefetching }
```

All Kit queries use the `VECHAIN_KIT` prefix — use it for broad invalidation:
```tsx
queryClient.invalidateQueries({ queryKey: ['VECHAIN_KIT'] }); // all Kit queries
queryClient.invalidateQueries({ queryKey: ['VECHAIN_KIT', 'CURRENT_BLOCK'] }); // specific
```

See the **frontend** skill for React Query caching, invalidation, and loading state patterns.

## useWallet -- Connection State

```tsx
import { useWallet } from '@vechain/vechain-kit';

function MyComponent() {
  const {
    account,          // Active account { address, domain, image } — smart account for Privy, wallet for DappKit
    connectedWallet,  // Current wallet regardless of method (Privy embedded or self-custody)
    smartAccount,     // { address, domain, image, isDeployed, isActive, version }
    privyUser,        // Privy User object if connected via Privy, null otherwise
    connection,       // Connection state and metadata
    disconnect,       // Disconnects + dispatches 'wallet_disconnected' event
  } = useWallet();

  // connection properties:
  // isConnected, isLoading,
  // isConnectedWithSocialLogin, isConnectedWithDappKit,
  // isConnectedWithCrossApp, isConnectedWithPrivy, isConnectedWithVeChain,
  // isInAppBrowser (true when running in VeWorld mobile browser),
  // source: { type: 'privy' | 'wallet' | 'privy-cross-app', displayName },
  // nodeUrl, delegatorUrl, chainId, network

  if (!connection.isConnected) return <div>Not connected</div>;
  return <div>Connected: {account?.address}</div>;
}
```

**SmartAccount**: `isDeployed` indicates whether the smart account contract is deployed on-chain (deployed lazily on first transaction to save gas). `version` is the contract version (V3 required for multi-clause + replay protection).

## useCallClause -- Contract Reads (preferred pattern)

Use `useCallClause` for all contract read operations. It wraps React Query for caching, refetching, and loading states. Prefer typed contract factories from `@vechain/vechain-contract-types` or your own TypeChain output.

```tsx
import { useCallClause, getCallClauseQueryKey } from '@vechain/vechain-kit';
import { MyContract__factory } from '../typechain-types';

// Basic usage with typed factory ABI
export const useTokenBalance = (address: string) => {
  return useCallClause({
    abi: MyContract__factory.abi,
    address: CONTRACT_ADDRESS,
    method: 'balanceOf',
    args: [address],
    queryOptions: { enabled: !!address },
  });
};

// In a component
function Balance({ address }: { address: string }) {
  const { data, isLoading } = useTokenBalance(address);
  if (isLoading) return <Skeleton height="20px" width="100px" />;
  return <div>Balance: {data?.toString()}</div>;
}
```

**Data transformation** with `select` (preferred over `useMemo` in components):
```tsx
return useCallClause({
  abi: VOT3__factory.abi,
  address: contractAddress,
  method: 'convertedB3trOf' as const,
  args: [address ?? ''],
  queryOptions: {
    enabled: !!address,
    select: (data) => ({
      balance: ethers.formatEther(data[0]),
      formatted: humanNumber(ethers.formatEther(data[0])),
    }),
  },
});
```

**Query keys** for cache invalidation:
```tsx
import {
  getCallClauseQueryKey,
  getCallClauseQueryKeyWithArgs,
} from '@vechain/vechain-kit';

// Without args (for methods with no params)
const key = getCallClauseQueryKey({
  abi, address: contractAddress, method: 'currentRoundId' as const,
});

// With args (for methods with params)
const key = getCallClauseQueryKeyWithArgs({
  abi, address: contractAddress, method: 'balanceOf' as const, args: [address],
});

queryClient.invalidateQueries({ queryKey: key });
```

**Organize contract hooks** in a dedicated directory (e.g., `src/api/contracts/`):
```
src/api/contracts/
├── useTokenBalance.ts
├── useTokenAllowance.ts
├── useVaultDeposit.ts
└── index.ts
```

## Batch Contract Reads

Use `executeMultipleClausesCall` for multiple reads in one call:

```tsx
import { executeMultipleClausesCall } from '@vechain/vechain-kit';

const thor = useThor();
const results = await executeMultipleClausesCall({
  thor,
  calls: addresses.map((addr) => ({
    abi: ERC20__factory.abi,
    functionName: 'balanceOf',
    address: addr as `0x${string}`,
    args: [userAddress],
  })),
});
```

## useBuildTransaction -- Clause Builder Pattern

Wraps `useSendTransaction` with a clause-builder function. Use `thor.contracts.load().clause` to build clauses from loaded contracts:

```tsx
import { useBuildTransaction, useWallet } from '@vechain/vechain-kit';

const useApproveAndSwap = () => {
  const { account } = useWallet();
  const thor = useThor();

  return useBuildTransaction({
    clauseBuilder: (tokenAddress: string, amount: string) => {
      if (!account?.address) return [];
      return [
        {
          ...thor.contracts.load(tokenAddress, ERC20__factory.abi)
            .clause.approve(swapAddress, ethers.parseEther(amount)).clause,
          comment: 'Approve token spending',
        },
        {
          ...thor.contracts.load(swapAddress, SwapContract__factory.abi)
            .clause.swap(tokenAddress, ethers.parseEther(amount)).clause,
          comment: 'Execute swap',
        },
      ];
    },
    onTxConfirmed: () => {
      queryClient.invalidateQueries({ queryKey: ['TOKEN_BALANCE'] });
    },
  });
};
```

## useSendTransaction -- Core Transaction Hook

**Use this for all transactions.** Handles both wallet and social login users automatically.

```tsx
import { useSendTransaction, useWallet } from '@vechain/vechain-kit';
import { useQueryClient } from '@tanstack/react-query';

function TransactionComponent() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  const {
    sendTransaction,
    status,              // 'ready' | 'pending' | 'waitingConfirmation' | 'success' | 'error'
    txReceipt,
    resetStatus,
    isTransactionPending,
    error,               // { type: 'UserRejectedError' | 'RevertReasonError', reason }
  } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
    // Gas options (pick one):
    // gasPadding: 0.2,       // Float 0–1: adds % buffer on top of estimated gas
    // suggestedMaxGas: 40000000, // Integer: explicit gas cap, overrides estimation + padding
    onTxConfirmed: () => {
      // CRITICAL: Invalidate ALL queries affected by this transaction.
      // Think through every component that reads data changed by the tx
      // (balances, registration status, navbar items, banners, lists).
      // See frontend.md "Cache Invalidation After Transactions" for details.
      queryClient.invalidateQueries({
        queryKey: getCallClauseQueryKey(CONTRACT, 'balanceOf', [account?.address]),
      });
    },
  });

  const handleSend = async () => {
    await sendTransaction([
      {
        to: '0xContractAddress',
        value: '0x0',
        data: '0xencodedFunctionData',
        comment: 'User-facing description of this operation',
        abi: functionABI,   // Optional: for UI display
      },
    ]);
  };

  return (
    <button onClick={handleSend} disabled={isTransactionPending}>
      {status === 'pending' ? 'Sending...' : 'Send Transaction'}
    </button>
  );
}
```

**Critical**: `useSendTransaction` is **mandatory** when social login is enabled. For apps without social login, you can alternatively use the `signer` exported by the kit and follow the SDK transaction guides directly.

**Critical**: Pre-fetch all data before calling `sendTransaction`. Fetching during submission can trigger browser pop-up blockers for social login users.

**Retry pattern**: Use `resetStatus` + `onTryAgain` for retry UX:
```tsx
const handleTryAgain = useCallback(async () => {
  resetStatus();
  await sendTransaction(clauses);
}, [sendTransaction, clauses, resetStatus]);

<TransactionModal onTryAgain={handleTryAgain} isClosable /* ...other props */ />
```

**Per-transaction delegation**: Override fee delegation for specific transactions:
```tsx
// App sponsors this transaction
await sendTransaction(clauses, 'https://your-delegator.com/delegate');

// User pays via Generic Delegator (default)
await sendTransaction(clauses);
```

## useTransferVET / useTransferERC20 -- Convenience Hooks

```tsx
import { useTransferVET, useTransferERC20, useWallet } from '@vechain/vechain-kit';

// VET transfer
const { sendTransaction } = useTransferVET({
  senderAddress: account?.address ?? '',
  receiverAddress: '0xRecipient',
  amount: '1000000000000000000', // 1 VET in wei
});

// ERC-20 transfer
const { sendTransaction } = useTransferERC20({
  senderAddress: account?.address ?? '',
  receiverAddress: '0xRecipient',
  amount: '1000000000000000000',
  tokenAddress: '0xTokenContract',
  tokenName: 'B3TR',
});
```

## Multi-Clause Transactions

```tsx
const handleBatchOperation = async () => {
  await sendTransaction([
    { to: tokenAddr, value: '0x0', data: approveData, comment: 'Approve spending' },
    { to: vaultAddr, value: '0x0', data: depositData, comment: 'Deposit tokens' },
  ]);
};
```

## Login Hooks

```tsx
import {
  useLoginWithPasskey,
  useLoginWithOAuth,
  useLoginWithVeChain,
} from '@vechain/vechain-kit';

const { loginWithPasskey } = useLoginWithPasskey();
const { initOAuth } = useLoginWithOAuth();
const { login: loginWithVeChain } = useLoginWithVeChain();

// OAuth providers: 'google' | 'twitter' | 'apple' | 'discord' | 'github' | 'linkedin'
```

## Blockchain Hooks

```tsx
import { useCurrentBlock, useTxReceipt, useEvents } from '@vechain/vechain-kit';

const { data: block } = useCurrentBlock();             // Auto-refreshes every 10s
const { data: receipt } = useTxReceipt(txId, 5);       // Poll for receipt (blockTimeout default: 5)
const { data: events } = useEvents({                   // Contract events
  abi: contractABI,
  address: '0xContract',
  eventName: 'Transfer',
  filterParams: { from: '0x...' },
});
```

## Network & Config Hooks

```tsx
import { useGetChainId, useGetNodeUrl, useAppConfig } from '@vechain/vechain-kit';

const { data: chainId } = useGetChainId();   // Chain ID from genesis block
const nodeUrl = useGetNodeUrl();              // Current node URL (custom or default)
```

### useAppConfig -- Merged Network Config

Returns the full `AppConfig` for the current network, with any `contractAddresses` overrides from the provider applied. Prefer this over `getConfig()` inside React components.

```tsx
import { useAppConfig } from '@vechain/vechain-kit';

function MyComponent() {
  const config = useAppConfig();
  // config.b3trContractAddress — uses provider override if set, otherwise network default
  // config.vot3ContractAddress
  // config.nodeUrl, config.explorerUrl, etc.
}
```

## Legal Documents Hook

After configuring `legalDocuments` on the provider, read agreement status with:

```tsx
import { useLegalDocuments } from '@vechain/vechain-kit';

const {
  documents,                    // All configured legal documents
  agreements,                   // User's agreement records
  documentsNotAgreed,           // Documents the user hasn't agreed to yet
  hasAgreedToRequiredDocuments, // Boolean — true when all required docs are accepted
} = useLegalDocuments();
```

## Oracle, Token, and Domain Hooks

```tsx
import {
  useGetTokenUsdPrice,
  useGetCustomTokenInfo,
  useGetCustomTokenBalances,
  useVechainDomain,
  useGetAvatar,
} from '@vechain/vechain-kit';

const { data: vetPrice } = useGetTokenUsdPrice('VET');   // Supported: 'VET', 'VTHO', 'B3TR' (on-chain oracle)
const { data: tokenInfo } = useGetCustomTokenInfo('0xToken');
const { data: balances } = useGetCustomTokenBalances(address, ['0xToken1', '0xToken2']);
const { data: domain } = useVechainDomain('0xAddress');   // address -> domain
const { data: resolved } = useVechainDomain('name.vet');  // domain -> address
const { data: avatar } = useGetAvatar('name.vet');
```

### VET Domain Hooks (full list)

**Resolution:**

- `useVechainDomain(addressOrDomain)` — returns `{ address?, domain?, isValidAddressOrDomain }`
- `useIsDomainProtected(domain)` — returns `boolean` (whether the domain is protected from claiming)
- `useGetDomainsOfAddress(address, parentDomain?)` — returns `{ domains: Array<{ name }> }`

**Records:**

- `useGetTextRecords(domain)` — returns all text records for a domain
- `useGetAvatar(domain)` — returns the avatar image URL directly (converts URI to URL), or `null`
- `useGetAvatarOfAddress(address)` — resolves the primary domain, then returns its avatar URL; falls back to a Picasso image if no domain or avatar is set
- `useGetResolverAddress(domain)` — returns the resolver contract address

**Mutations:**

- `useUpdateTextRecord({ resolverAddress, onSuccess?, onError?, signerAccountAddress? })` — returns `{ sendTransaction, isTransactionPending, error }`
- `useClaimVeWorldSubdomain({ subdomain, domain, onSuccess?, onError?, alreadyOwned? })` — returns `{ sendTransaction, isTransactionPending, error }` (specific to `veworld.vet` subdomains)

### VET Domain Text Records

`.vet` domains support ENS-compatible text records — key-value pairs stored on the resolver (ENSIP-5/18). Common records: `display` (preferred capitalisation), `avatar`, `description`, `header` (banner image, 1:3 ratio), `email`, `url`, `location`, `phone`, `keywords`. Apps can also store custom records with a prefix (e.g. `com.discord`, `org.reddit`). Records are read from the name's resolver; write availability depends on the resolver implementation.

## NFT and IPFS Hooks

```tsx
import { useNFTImage, useNFTMetadataUri, useIpfsImage } from '@vechain/vechain-kit';

// Full flow: address → tokenId → metadata → image (all resolved automatically)
const { imageData, imageMetadata, tokenID, isLoading } = useNFTImage({
  address: walletAddress,
  contractAddress: nftContractAddress,
});

// Just the metadata URI for a known token ID
const { data: metadataUri } = useNFTMetadataUri({ tokenId, contractAddress });

// Resolve any IPFS URI to a gateway URL
const { data: imageUrl } = useIpfsImage(ipfsUri);
```

## Sign Messages

```tsx
import { useSignMessage, useSignTypedData } from '@vechain/vechain-kit';

// Sign a plain message
const { signMessage, isSigningPending, signature } = useSignMessage();
const sig = await signMessage('Hello VeChain');

// Sign EIP-712 typed data
const {
  signTypedData,
  isSigningPending: isTypedPending,
  signature: typedSig,
} = useSignTypedData();

const result = await signTypedData({
  domain: { name: 'MyApp', version: '1', chainId: 100009 },
  types: { Message: [{ name: 'content', type: 'string' }] },
  message: { content: 'Verify wallet ownership' },
  primaryType: 'Message',
}, { signer: account?.address }); // signer option required for proper routing
```

## Certificate Signing (Wallet Authentication)

To verify wallet ownership for backend JWT flows, use `signTypedData` with EIP-712. **Do not use `useConnex` / `connex.vendor.sign('cert', ...)`** — that is deprecated.

**Smart account warning:** Social login users own a smart account (contract). They sign with their Privy embedded wallet, not the smart account directly. Your backend **must verify that the signer address is the owner of the smart account**, not just compare it to the connected address.

**Frontend hook pattern:**

```tsx
const { signTypedData } = useSignTypedData();
const { account } = useWallet();

const domain = { name: 'MyApp', version: '1' };
const types = {
  Authentication: [
    { name: 'user', type: 'address' },
    { name: 'timestamp', type: 'string' },
  ],
};

const message = { user: account?.address, timestamp: new Date().toISOString() };
const signature = await signTypedData(
  { domain, types, message, primaryType: 'Authentication' },
  { signer: account?.address },
);
// Send { signature, message } to your backend
```

**Backend verification:**

```typescript
import { ethers } from 'ethers';

const signerAddress = ethers.verifyTypedData(domain, types, message, signature);
// For wallet users: signerAddress === account address
// For social login users: signerAddress is the embedded wallet —
//   verify it is the owner of the smart account on-chain
```

## Language and Currency Hooks

Bidirectional sync between VeChain Kit settings and your app. Changes in either direction are reflected in both places. Values persist in localStorage (`i18nextLng` for language, `vechain_kit_currency` for currency).

**Provider props:**

```tsx
<VeChainKitProvider
  language="en"                        // Initial language code
  defaultCurrency="usd"               // 'usd' | 'eur' | 'gbp'
  onLanguageChange={(lang) => {}}      // Fired when user changes language in Kit settings
  onCurrencyChange={(currency) => {}}  // Fired when user changes currency in Kit settings
>
```

**Hooks:**

```tsx
import {
  useCurrentLanguage,
  useCurrentCurrency,
  useVeChainKitConfig,
} from '@vechain/vechain-kit';

// Language
const { currentLanguage, setLanguage } = useCurrentLanguage();
setLanguage('fr');

// Currency
const { currentCurrency, setCurrency } = useCurrentCurrency();
setCurrency('eur'); // 'usd' | 'eur' | 'gbp'

// Full config (includes both + other config properties)
const config = useVeChainKitConfig();
config.currentLanguage; // current runtime value
config.currentCurrency; // current runtime value
config.setLanguage('de');
config.setCurrency('gbp');
```

## @vechain/contract-getters (Framework-Agnostic Reads)

For read-only blockchain queries outside of React components, use `@vechain/contract-getters`. It provides typed getters for VeBetterDAO data (B3TR, VOT3 balances, allocation voting, VeBetter Passport), VET domains, ERC-20 tokens, and more. Works in both Node.js and browser environments.

```bash
npm install @vechain/contract-getters
# Peer dependencies
npm install @vechain/vechain-contract-types @vechain/sdk-network ethers
```

**Simplest usage (no client setup needed — defaults to mainnet):**

```typescript
import { getVot3Balance, getB3trBalance } from '@vechain/contract-getters';

const vot3Balance = await getVot3Balance('0xUserAddress');
const b3trBalance = await getB3trBalance('0xUserAddress');
```

**With custom network:**

```typescript
import { getVot3Balance } from '@vechain/contract-getters';

const balance = await getVot3Balance('0xUserAddress', {
  networkUrl: 'https://testnet.vechain.org',
});
```

**With existing ThorClient (for projects already using VeChain SDK):**

```typescript
import { ThorClient } from '@vechain/sdk-network';
import { VeChainClient, getVot3Balance } from '@vechain/contract-getters';

const thorClient = ThorClient.at('https://testnet.vechain.org');
const vechainClient = VeChainClient.from(thorClient);

const balance = await getVot3Balance('0xUserAddress', { client: vechainClient });
```

**Available modules:** `b3tr`, `vot3`, `erc20`, `vetDomain`, `allocationVoting`, `allocationPool`, `veBetterPassport`, `relayerRewardsPool`.

Use this package when you need blockchain reads in:

- Backend scripts or API routes
- Non-React frontend frameworks
- Utility functions outside of component lifecycle

For React components, prefer the VeChain Kit hooks (`useCallClause`, `useVechainDomain`, etc.) instead, as they integrate with React Query for caching and reactivity.

## Source: `vechain-ai-skills/skills/vechain-kit/references/kit-setup.md`

# VeChain Kit — Setup & Configuration

## When to use

Use when the user asks about: installing VeChain Kit, provider setup, CSS framework choice, Tailwind compatibility, environment variables, login methods, legal documents, ecosystem apps, or common setup issues.

---

## Installation

**Important:** VeChain Kit requires `--legacy-peer-deps` due to peer dependency conflicts.

**Before installing**, check the existing project:

- **React Query (`@tanstack/react-query`)**: VeChain Kit hooks depend on it. If the project doesn't have it yet, ask the developer if they want to add it (they almost certainly do — it's required for `useCallClause` and all data-fetching hooks). If the project uses a different data-fetching library (SWR, etc.), flag the potential conflict.
- **CSS framework**: See [CSS Framework Choice](#css-framework-choice) below — ask whether to keep Tailwind or switch to Chakra UI.

```bash
yarn add --legacy-peer-deps @vechain/vechain-kit

# Required peer dependencies
yarn add --legacy-peer-deps @chakra-ui/react@^2.8.2 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0 \
  @tanstack/react-query@^5.64.2 \
  @vechain/dapp-kit-react@2.1.0-rc.1 \
  framer-motion@^11.15.0

# Recommended: pre-built ABIs for VeChain ecosystem contracts
yarn add @vechain/vechain-contract-types
```

For npm, use `npm install --legacy-peer-deps` instead.

**Why `@vechain/vechain-contract-types`?** It provides TypeChain-generated ABIs and factories for all major VeChain ecosystem contracts (B3TR, VOT3, StarGate, VET domains, smart accounts, etc.). Use these with `useCallClause` instead of hand-writing ABIs. See the **smart-contract-development** skill (`references/abi-codegen.md`) for the full list.

**If the project doesn't have React Query yet**, also set up the `QueryClientProvider`:

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* VeChainKitProvider goes here */}
      {children}
    </QueryClientProvider>
  );
}
```

## CSS Framework Choice

VeChain Kit uses **Chakra UI v2** internally for all its modal and UI components. When setting up a new project, **ask the developer** which approach they prefer:

| Option | Pros | Cons |
|--------|------|------|
| **Use Chakra UI for the whole app** (recommended) | Full visual consistency with VeChain Kit modals, no CSS conflicts, access to Chakra's component library | Must learn Chakra if unfamiliar |
| **Keep Tailwind CSS** | Developer stays in familiar framework | Requires preflight fix (see below), possible style inconsistencies between app UI and VeChain Kit modals |

**If the developer chooses Chakra UI:** no extra CSS configuration needed — Chakra's `ChakraProvider` and VeChain Kit share the same styling engine. Use Chakra components (`Box`, `Button`, `Text`, `Flex`, etc.) throughout the app.

**If the developer keeps Tailwind CSS (especially v4):** apply the preflight fix below.

### Tailwind CSS v4 Compatibility

Tailwind CSS v4's preflight (CSS reset) **conflicts with Chakra UI's styles** inside VeChain Kit modals — buttons collapse, inputs lose height, spacing breaks.

**Fix: disable Tailwind's preflight.** Replace the default Tailwind import with individual imports that skip `preflight.css`:

```css
/* app/globals.css — BEFORE (broken with VeChain Kit) */
@import "tailwindcss";

/* app/globals.css — AFTER (compatible with VeChain Kit) */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
/* Omit: @import "tailwindcss/preflight.css" layer(base); */
@import "tailwindcss/utilities.css" layer(utilities);
```

This removes Tailwind's CSS reset while keeping all utilities and theme variables. Chakra UI applies its own reset inside VeChain Kit components, so they render correctly.

## Provider Setup (Next.js App Router)

VeChain Kit must be dynamically imported to prevent SSR issues.

**Without own Privy credentials (free shared Privy):**

Use `vechain` for social login — it bundles all social methods (email, Google, passkey, etc.) through VeChain's shared Privy. You **cannot** use `email`, `google`, `passkey`, or `more` individually without your own Privy credentials — doing so will throw a configuration error.

```tsx
// app/providers.tsx
'use client';
import dynamic from 'next/dynamic';

const VeChainKitProvider = dynamic(
  () => import('@vechain/vechain-kit').then(mod => mod.VeChainKitProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      network={{ type: 'test' }}   // 'main' | 'test' | 'solo'
      darkMode={true}
      language="en"
      loginModalUI={{
        logo: '/logo.png',
        description: 'My VeChain dApp',
      }}
      loginMethods={[
        { method: 'veworld', gridColumn: 4, isPrimary: true },  // recommended CTA — filled, dot
        { method: 'vechain', gridColumn: 4 },                   // all social login via VeChain's Privy
        { method: 'wallet-connect', gridColumn: 4 },            // WC QR modal triggered programmatically
      ]}
      feeDelegation={{
        delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL,
      }}
      dappKit={{
        allowedWallets: ['veworld', 'wallet-connect'],
        walletConnectOptions: {
          projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '',
          metadata: {
            name: 'My dApp',
            description: 'A VeChain dApp',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: [],
          },
        },
      }}
      // No privy prop needed — uses VeChain's shared credentials

      // Contract address overrides (optional) — for custom deployments on solo/testnet
      // contractAddresses={{
      //   b3trContractAddress: '0x...',
      //   vot3ContractAddress: '0x...',
      // }}
    >
      {children}
    </VeChainKitProvider>
  );
}
```

**With own Privy credentials (better UX, pick individual methods):**

```tsx
<VeChainKitProvider
  // ...same config as above, but with individual login methods and privy prop:
  loginMethods={[
    { method: 'veworld', gridColumn: 4, isPrimary: true },  // recommended CTA — filled, dot
    { method: 'google',  gridColumn: 4 },                   // outline secondary
    { method: 'apple',   gridColumn: 4 },                   // outline secondary
    { method: 'more',    gridColumn: 4 },                   // sub-view with overflow wallets / socials / ecosystem
  ]}
  privy={{
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '',
    clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? '',
  }}
>
```

Then wrap `app/layout.tsx` with `<Providers>`.

## Environment Variables

Create `.env.local` with the required variables:

```bash
# Required for WalletConnect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Optional: fee delegation (omit to use Generic Delegator — users pay own gas)
NEXT_PUBLIC_DELEGATOR_URL=https://your-delegator.com/delegate

# Optional: own Privy credentials (only if using individual social methods)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id
```

## Common Setup Pitfalls

1. **SSR errors**: VeChain Kit must be dynamically imported with `{ ssr: false }` (shown above). Without this, Next.js will crash during server rendering.
2. **Missing `--legacy-peer-deps`**: Installation fails without this flag due to Chakra UI v2 peer dependency conflicts. Required with React 19 / Next.js 15+.
3. **Tailwind v4 breaks modal**: See [Tailwind CSS v4 Compatibility](#tailwind-css-v4-compatibility) above.
4. **Using `email`/`google`/`passkey` without Privy credentials**: Throws _"Login methods require Privy configuration"_. Use `{ method: 'vechain' }` instead for free social login.
5. **Missing WalletConnect project ID**: Wallet connection will fail silently. Always provide `NEXT_PUBLIC_WC_PROJECT_ID`.
6. **tsconfig target too low**: VeChain SDK uses BigInt literals (`0n`). Set `"target": "ES2020"` or higher in `tsconfig.json`.
7. **BigInt serialization error** ("Do not know how to serialize a BigInt"): Set wagmi's `hashFn` as default `queryKeyHashFn`:

    ```tsx
    import { hashFn } from 'wagmi/query';
    const queryClient = new QueryClient({
      defaultOptions: { queries: { queryKeyHashFn: hashFn } },
    });
    ```

8. **Restricting wallets**: Use `dappKit: { allowedWallets: ['veworld'] }` to show only VeWorld (omit `'wallet-connect'` if you don't need WalletConnect and don't have a project ID).
9. **Privy popup blocking**: Browsers block popups that open after an async call. Pre-fetch all data before triggering `sendTransaction` so the Privy signing popup opens synchronously.
10. **Missing `ColorModeScript`**: If VeChain Kit modals render with wrong colors, add `<ColorModeScript initialColorMode="dark" />` inside your `ChakraProvider`.
11. **CSS conflicts with Bootstrap or custom CSS**: Use CSS layers — `@layer vechain-kit, host-app;` — and wrap your framework styles in `@layer host-app { ... }`.

## Testing (mocking VeChain Kit hooks)

```tsx
jest.mock('@vechain/vechain-kit', () => ({
  useWallet: () => ({ account: { address: '0x123...' }, isConnected: true }),
  useCallClause: () => ({ data: [BigInt('1000000000000000000')], isLoading: false, error: null }),
}));
```

## Sub-path Exports

VeChain Kit exposes additional exports via sub-paths:

```tsx
// Contract factories (re-exports from @vechain/vechain-contract-types)
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';

// Utility functions
import { humanAddress } from '@vechain/vechain-kit/utils';

// Network config (contract addresses, chain IDs)
import { getConfig, useAppConfig } from '@vechain/vechain-kit';
const b3trAddress = getConfig('main').b3trContractAddress;
// In React components, prefer useAppConfig() — it respects contractAddresses overrides
const config = useAppConfig();
const b3tr = config.b3trContractAddress;
```

## Login Methods

From v2.7 the kit owns the **entire VeWorld and Sync2 connection flow** end-to-end — no hand-off to dapp-kit's native picker. WalletConnect still uses WalletConnect's own QR modal (triggered programmatically). The legacy `dappkit` entry is preserved for backwards compatibility.

| Method            | Description                                                                                                | Requires Privy        | Gated by `dappKit.allowedWallets` |
|-------------------|------------------------------------------------------------------------------------------------------------|-----------------------|-----------------------------------|
| `veworld`         | Custom VeWorld flow + the kit's "Waiting for signature…" view. Primary CTA (filled, recommended dot)        | No                    | Yes — needs `'veworld'`            |
| `sync2`           | Custom Sync2 flow + same waiting view                                                                       | No                    | Yes — needs `'sync2'`              |
| `wallet-connect`  | Triggers WalletConnect's QR modal programmatically (kit's loading view sits behind)                         | No                    | Yes — needs `'wallet-connect'`     |
| `vechain`         | All social login via VeChain's shared Privy (free; slightly worse UX — VeChain branding, extra redirect)    | No                    | —                                  |
| `ecosystem`       | Footer button → sub-view of x2earn ecosystem apps                                                           | No                    | —                                  |
| `email`           | Inline email pill + 6-digit code modal                                                                      | **Yes**               | —                                  |
| `passkey`         | Privy WebAuthn                                                                                              | **Yes**               | —                                  |
| `google`          | Google OAuth (full-color "G")                                                                              | **Yes**               | —                                  |
| `apple`           | Apple OAuth                                                                                                 | **Yes**               | —                                  |
| `github`          | GitHub OAuth                                                                                                | **Yes**               | —                                  |
| `more`            | "More options ⌄" link footer → sub-view with overflow wallets / socials (incl. Privy fallback for Twitter/Discord/etc.) / ecosystem apps | **Yes** (for socials)  | —                                  |
| `dappkit` _(legacy)_ | Opens dapp-kit's native picker modal. Preserved for backwards compatibility — prefer the granular methods above | No                    | —                                  |

**Defaults** (when `loginMethods` is omitted):

- With `privy`: `[veworld, google, apple, more]`
- Without `privy`: `[veworld, sync2, wallet-connect]`

**Important:** Without the `privy` prop, `email`, `passkey`, and `sms` throw a configuration error (no whitelabel equivalent for those — they need to run inline at the dApp's origin). Everything else (`vechain`, `google`, `apple`, `twitter`, `discord`, `github`, `tiktok`, `line`, `more`, wallet methods) works without your own Privy account.

**Grid layout:** `gridColumn` controls the width of each login button in a 4-column grid. Use `4` for full width, `2` for half width.

**Recommended CTA:** mark one entry with `isPrimary: true` to render it as the recommended CTA — filled inverted surface + green "recommended" dot. If no entry sets `isPrimary`, the kit auto-highlights the first visible method. `isPrimary` on `more` is ignored (it's a footer link). The filled treatment currently supports `veworld`, `google`, `apple`, and `github`; other methods stay outline even if marked primary.

**Driving a single wallet from custom UI:**

```tsx
import { useConnectWithDappKitSource, useModal } from '@vechain/vechain-kit';

const { setConnectModalContent, openConnectModal } = useModal();
const { connect } = useConnectWithDappKitSource('veworld', setConnectModalContent);
//                                              ^^^^^^^^ 'veworld' | 'sync2' | 'wallet-connect'

<button onClick={async () => { openConnectModal(); await connect(); }}>Connect VeWorld</button>
```

## Ecosystem Apps

Filter which ecosystem apps appear when using `{ method: 'ecosystem' }`:

```tsx
<VeChainKitProvider
  loginMethods={[
    { method: 'ecosystem', gridColumn: 4 },
  ]}
  ecosystemApps={{
    allowedApps: ['app-id-1', 'app-id-2'], // App IDs from the Privy dashboard
  }}
>
```

## Contract Address Overrides

Override default contract addresses for custom deployments (e.g., solo or testnet with your own B3TR/VOT3 instances). Accepts `Partial<AppConfig>` — only provided fields are overridden:

```tsx
<VeChainKitProvider
  network={{ type: 'solo' }}
  contractAddresses={{
    b3trContractAddress: '0x026771d1be764467f8bdb78bb230df10c924b00d',
    vot3ContractAddress: '0xf7a08af15cb3501feee53ebe11f4428a966fa459',
    // Any AppConfig field can be overridden
  }}
>
```

Access the merged config (defaults + overrides) in components with `useAppConfig`:

```tsx
import { useAppConfig } from '@vechain/vechain-kit';

const config = useAppConfig();
const b3trAddress = config.b3trContractAddress; // overridden value if provided
```

`useAppConfig` is preferred over `getConfig()` inside React components, as it respects provider overrides. `getConfig()` only returns built-in network defaults.

## Legal Documents (Optional)

Prompt users to accept Terms & Conditions, Privacy Policy, or Cookie Policy on wallet connect. Agreements are stored in local storage per wallet address + document type + version + URL. Incrementing `version` re-prompts users.

```tsx
<VeChainKitProvider
  legalDocuments={{
    allowAnalytics: true, // Optional: prompt for VeChainKit tracking consent
    termsAndConditions: [
      {
        displayName: 'MyApp T&C',
        url: 'https://myapp.com/terms',
        version: 1,
        required: true, // Must accept to proceed
      },
    ],
    privacyPolicy: [
      {
        url: 'https://myapp.com/privacy',
        version: 1,
        required: false, // Optional: user can skip
      },
    ],
    cookiePolicy: [
      {
        url: 'https://myapp.com/cookies',
        version: 1,
        required: false,
      },
    ],
  }}
>
```

Each document entry supports: `displayName` (optional label), `url`, `version`, `required` (boolean).

## Source: `vechain-ai-skills/skills/vechain-kit/references/kit-social-login.md`

# VeChain Kit — Social Login & Smart Accounts

## When to use

Use when the user asks about: social login, smart accounts, account abstraction, Privy setup, fee delegation for social login, or DIY social login with dapp-kit.

---

## Smart Accounts

- Social login users get a **Smart Account** (account abstraction) via CREATE2
- Deterministic address (can receive tokens before deployment)
- V3 required for multi-clause and replay protection
- Check: `useUpgradeRequiredForAccount`
- **Factory addresses** (must use the [official factory](https://github.com/vechain/smart-accounts) for ecosystem compatibility):
  - Mainnet: `0xC06Ad8573022e2BE416CA89DA47E8c592971679A`
  - Testnet: `0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF`

## Privy Setup (Optional for Social Login)

VeChain Kit ships with social login out of the box — **no Privy account is required**. There are two paths; pick the one that fits your needs.

### Option A: Use VeChain's whitelabel cross-app host (free, no setup, recommended for most apps)

Omit the `privy` prop entirely. The kit routes social logins through VeChain's whitelabel popup (`cross-app-connect`), which runs on VeChain branding and gives the user **one identity across every kit-integrated dApp**.

What works without your own Privy:
- `{ method: 'vechain' }` — a single "Continue with VeChain" button that opens the popup picker.
- `{ method: 'google' }`, `{ method: 'apple' }`, `{ method: 'twitter' }`, `{ method: 'discord' }`, `{ method: 'github' }`, `{ method: 'tiktok' }`, `{ method: 'line' }` — direct buttons that open the popup pre-selected on that provider (one-tap login).
- `useLoginWithOAuth().initOAuth({ provider })` for the same provider set, driven from your own UI.

What still requires your own Privy (Option B):
- `{ method: 'email' }`, `{ method: 'passkey' }`, `{ method: 'sms' }` — these have to run inside your dApp's origin and need its own Privy credentials.
- Custom OAuth providers not in the kit's whitelabel set (LinkedIn, Spotify, Instagram, etc.).

Calling an unsupported method without `privy` throws a configuration error pointing to the supported set.

### Option B: Use your own Privy account (full control)

Create an app at [privy.io](https://privy.io), retrieve your **App ID** and **Client ID** from the App Settings tab, and pass them to `VeChainKitProvider` (see [setup guide](https://docs.vechainkit.vechain.org/quickstart/setup-privy-optional)):
```tsx
<VeChainKitProvider
  privy={{
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
  }}
>
```

The `privy` prop also accepts `appearance`, `embeddedWallets`, and other [Privy SDK options](https://docs.privy.io/) as pass-through configuration.

### Option A vs Option B trade-offs

| | Whitelabel cross-app (A) | Self-hosted Privy (B) |
|---|---|---|
| Cost | Free | Privy pricing |
| Setup | Zero | Privy dashboard config + env vars |
| Branding | VeChain-branded popup window | Your branding inside your dApp |
| Login surface | Brief popup window (handles OAuth + posts result back) | Inline modal — no popup |
| User wallet | Shared across all kit-integrated dApps (one VeChain identity) | Scoped to your dApp |
| Methods available | Google, Apple, X, Discord, GitHub, TikTok, LINE, plus the picker for everything else | Everything Privy supports (email, passkey, SMS, additional OAuth providers, …) |
| Transaction prompts | Popup confirmation per signature | No UI confirmations |
| Cross-app identity | Built-in | User has to ecosystem-link |
| Security ownership | VeChain owns the Privy account | You secure your Privy account |

**Security:** If self-hosting Privy, review the [implementation checklist](https://docs.privy.io/guide/security/implementation/) and [CSP guide](https://docs.privy.io/guide/security/implementation/csp).

**Accessing Privy directly:** VeChain Kit re-exports Privy hooks — import from the kit, not from `@privy-io/react-auth`:
```tsx
import { usePrivy } from '@vechain/vechain-kit';

const { user } = usePrivy();
```

## Fee Delegation for Social Login

VeChain Kit v2 auto-enables the **Generic Delegator** by default -- users pay their own gas in VET, VTHO, or B3TR. No `feeDelegation` config is required.

To improve UX, you can optionally sponsor transactions so users pay nothing:
```tsx
<VeChainKitProvider feeDelegation={{ delegatorUrl: 'https://your-delegator.com/delegate' }}>
```

See the **vechain-core** skill (`references/fee-delegation.md`) for Generic Delegator gas estimation, per-transaction sponsorship, and vechain.energy setup.

## Pre-fetch Data Before Transactions

Fetching during `sendTransaction` blocks popups for social login:
```tsx
// GOOD: data ready before transaction
const { data: balance } = useCallClause({ ... });
const handleSend = () => sendTransaction(clauses);

// BAD: fetching inside handler
const handleSend = async () => {
  const balance = await fetchBalance(); // May block popup
  sendTransaction(clauses);
};
```

---

## DIY Social Login with dapp-kit + Privy (Not Recommended)

An alternative to VeChain Kit's built-in social login is using dapp-kit while handling Privy integration, smart account management, and EIP-712 signing yourself. **This adds significant complexity and is not recommended unless you have a specific reason VeChain Kit cannot work for your use case.**

- [Tutorial](https://docs.vechain.org/developer-resources/example-dapps/pwa-with-privy-and-account-abstraction)
- [Example repo](https://github.com/vechain-energy/docs-pwa-privy-account-abstraction-my-pwa-project)
- [Smart accounts factory](https://github.com/vechain/smart-accounts)

### VeChain Kit vs DIY Comparison

| Concern | VeChain Kit (recommended) | DIY with dapp-kit |
|---------|--------------------------|-------------------|
| Smart account contracts | Uses official pre-deployed factory | Must deploy your own OR integrate official factory |
| EIP-712 signing | Automated in `useSendTransaction` | Manual typed data construction |
| Account deployment detection | Built-in (lazy deploy on first tx) | Custom logic required |
| Replay protection | Built-in nonce handling (V3) | Manual nonce management |
| Version upgrades (V1→V3) | `useUpgradeRequiredForAccount` + modal | Must track yourself |
| Batch/multi-clause | Automated via `executeBatchWithAuthorization` | Must build manually |
| iOS/Android signing | Handled (custom domain separator) | Not addressed in tutorial |
| Cross-app compatibility | Supported via `@privy-io/cross-app-connect` | Not supported |
| Provider setup | Single `<VeChainKitProvider>` | Nested `<PrivyProvider>` + custom `<VeChainAccountProvider>` |

### Critical: Use the Official Smart Accounts Factory

If you take the DIY path, you **must** use the [official vechain/smart-accounts factory](https://github.com/vechain/smart-accounts) (`0xC06Ad...` mainnet / `0x713b9...` testnet). Deploying your own factory (as the tutorial does) creates smart accounts that are **not compatible** with VeChain Kit, VeWorld, or other VeChain ecosystem apps. Users would have different addresses across apps.

See [Smart Accounts documentation](https://docs.vechainkit.vechain.org/social-login/smart-accounts) for factory details.

### What You Must Implement Yourself

1. **EIP-712 typed data construction** -- build and sign authorization payloads for `executeWithAuthorization`
2. **Lazy account deployment** -- detect undeployed accounts and inject factory creation clauses on first transaction
3. **Fee delegation integration** -- separate sponsor signature flow
4. **Nonce management** -- for `executeBatchWithAuthorization` replay protection
5. **Version migration** -- the factory has evolved V1→V3 (V2 was skipped); handle upgrades
6. **HTTPS requirement** -- Privy uses `crypto.subtle`, requiring HTTPS even in development (e.g., ngrok)
7. **Ephemeral wallet for submission** -- generate a random wallet as the transaction entry point; actual auth comes from the Privy-signed EIP-712 message

### When DIY Might Be Justified

- You need custom smart account logic beyond what SimpleAccount V3 provides
- You need full control over the signing/submission pipeline
- You are building for a non-React framework where VeChain Kit cannot run

## Source: `vechain-ai-skills/skills/vechain-kit/references/kit-theming.md`

# VeChain Kit — Theming & Compatibility

## When to use

Use when the user asks about: theming VeChain Kit, customizing colors/fonts/buttons, Chakra UI compatibility, bottom sheet on mobile, glass effects, or webpack fallbacks.

---

## Theming

Minimal config: set `modal.backgroundColor` and `textColor` — all other colors auto-derive. Import `VechainKitThemeConfig` for type safety.

```tsx
import type { VechainKitThemeConfig } from '@vechain/vechain-kit';

const theme: VechainKitThemeConfig = {
  modal: {
    backgroundColor: isDarkMode ? '#1f1f1e' : '#ffffff',
    useBottomSheetOnMobile: true, // Slide-up bottom sheet on mobile instead of centered modal
    // border, backdropFilter, rounded are optional
  },
  textColor: isDarkMode ? 'rgb(223, 223, 221)' : '#2e2e2e',
  // Brand accent — spinner top arc, focus rings, "Waiting for signature…"
  // headline in the connect modal, and the email-submit link when valid.
  // Defaults: '#3b82f6' (light) / '#60a5fa' (dark).
  accent: '#ff6600',
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    blur: 'blur(3px)',
  },
  buttons: {
    primaryButton: { bg: '#3182CE', color: 'white', border: 'none' },
    secondaryButton: { bg: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' },
    tertiaryButton: { bg: 'transparent', color: '#fff', border: 'none' },
    loginButton: { bg: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
  },
  fonts: {
    family: 'Inter, sans-serif',
    sizes: { small: '12px', medium: '14px', large: '16px' },
    weights: { normal: 400, medium: 500, bold: 700 },
  },
  effects: {
    glass: { enabled: true, intensity: 'low' }, // 'low' | 'medium' | 'high'
  },
};

<VeChainKitProvider theme={theme} {...otherProps}>
```

## Theme API reference

| Prop | Shape | Notes |
|------|-------|-------|
| `modal` | `{ backgroundColor, border, backdropFilter, rounded, useBottomSheetOnMobile }` | Modal container. `backgroundColor` auto-derives card (80%), header (90%), secondary/tertiary, and border colors. `useBottomSheetOnMobile`: slide-up bottom sheet on mobile |
| `textColor` | `string` | Auto-derives primary (100%), secondary (70%), tertiary (50%) text |
| `accent` | `string` | Brand accent. Drives the connect modal's spinner top arc, focus rings, "Waiting for signature…" headline, and the email-submit link when the address is valid. Default `#3b82f6` (light) / `#60a5fa` (dark) |
| `overlay` | `{ backgroundColor, blur }` | Modal overlay backdrop |
| `buttons` | `{ primaryButton, secondaryButton, tertiaryButton, loginButton }` | Each: `{ bg, color, border, backdropFilter?, rounded? }` |
| `fonts` | `{ family, sizes?, weights? }` | `sizes`: `{ small, medium, large }`. `weights`: `{ normal, medium, bold }`. Scoped to Kit components only — does not affect host app |
| `effects` | `{ glass: { enabled, intensity } }` | Glass morphism; intensity: `'low'` / `'medium'` / `'high'` |

**Common mistakes:**

- `buttons.primary.background` does not exist — use `buttons.primaryButton.bg`
- `font.family` does not exist — use `fonts.family`
- `hoverBg` does not exist in the types

## Chakra UI v3 compatibility

VeChain Kit uses Chakra UI v2 internally. When the host app uses Chakra v3, **pin `@chakra-ui/react` to an exact working version** (currently `3.30.0`). Newer v3 releases can change CSS variable generation and break VeChain Kit's button/modal styling (wrong colors, missing backgrounds). Do NOT use `^` ranges like `^3.26.0`.

### `useToken` returns a snapshot, not a CSS variable

Chakra v3's `useToken('colors', 'bg.primary')` returns the **resolved literal color** at render time (e.g. `#1B1D1F`), NOT a CSS variable reference. If you pipe that snapshot into the Kit's `theme` prop, the Kit's modal/card/sticky-header colors **freeze in whichever mode Chakra evaluated first** and stop tracking host theme toggles (next-themes, html.dark, etc.). Only Kit components reading `useVeChainKitConfig().darkMode` directly (e.g. the VeWorld button) will react.

**Wrong:**

```tsx
// ❌ freezes to whatever mode Chakra evaluated first
const [bgPrimary, primaryDefault] = useToken('colors', [
  'bg.primary',
  'actions.primary.default',
])
<VeChainKitProvider theme={{ modal: { backgroundColor: bgPrimary }, ... }} />
```

**Right — use Chakra v3's `sys.token.var(...)` resolver so the Kit gets a `var(...)` reference that flips at paint time:**

```tsx
import { useChakraContext } from '@chakra-ui/react'

const sys = useChakraContext()
const tokVar = (p: string) => sys.token.var(`colors.${p}`) as string

const bgPrimary      = tokVar('bg.primary')              // 'var(--vbd-colors-bg-primary)'
const primaryDefault = tokVar('actions.primary.default')
// …etc

<VeChainKitProvider theme={{ modal: { backgroundColor: bgPrimary }, ... }} />
```

Hardcoding `'var(--vbd-colors-bg-primary)'` strings works too if the `cssVarsPrefix` is fixed.

To verify after wiring: in DevTools, `--chakra-colors-vechain-kit-modal` should resolve to `var(--your-prefix-...)` (and switch on theme toggle), not to a hex literal.

A full repro lives at `examples/next-chakra-v3/` in [vechain/vechain-kit](https://github.com/vechain/vechain-kit).

## Webpack fallbacks for Next.js

Some VeChain packages (e.g. `@vechain/vebetterdao-relayer-node`) import Node.js modules (`fs`, `net`, `tls`). For Next.js client-side builds, add webpack fallbacks in `next.config.js`:

```js
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false }
  }
  return config
},
```

## Source: `vechain-ai-skills/skills/vechain-kit/references/translations-vechain-kit.md`

# Translations and VeChain Kit

When the host app uses react-i18next and VeChain Kit, keep both in sync so that changing language in the app updates Kit UI and changing language in Kit (e.g. wallet modal) updates the app.

## Bi-directional language sync

### Host app → VeChain Kit

When the user changes language in the **host app** (e.g. footer selector calling `i18n.changeLanguage(...)`), notify Kit:

- Inside the `VeChainKitProvider` tree, subscribe to `i18n.on("languageChanged", ...)` and call Kit's `setLanguage(lng)` from `useCurrentLanguage()`.
- Do this in a small child component that has access to both `useTranslation()` and `useCurrentLanguage()`.

### VeChain Kit → host app

When the user changes language **inside Kit** (e.g. wallet modal), update the host app:

- Pass into `VeChainKitProvider`: `language={i18n.language}` and `onLanguageChange={(language) => { if (i18n.language !== language) i18n.changeLanguage(language) }}`.

### Implementation pattern

```tsx
// 1) Child: sync app i18n → Kit
function LanguageSync({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const { setLanguage: setKitLanguage } = useCurrentLanguage()

  useEffect(() => {
    const handle = (lng: string) => setKitLanguage(lng)
    i18n.on("languageChanged", handle)
    return () => i18n.off("languageChanged", handle)
  }, [i18n, setKitLanguage])
  return <>{children}</>
}

// 2) Provider: pass current language and Kit → app handler
export function VechainKitProviderWrapper({ children }) {
  const { i18n } = useTranslation()
  const handleLanguageChange = (language: string) => {
    if (i18n.language !== language) i18n.changeLanguage(language)
  }

  return (
    <VeChainKitProvider
      language={i18n.language}
      onLanguageChange={handleLanguageChange}
      {/* ...other props */}
    >
      <LanguageSync>{children}</LanguageSync>
    </VeChainKitProvider>
  )
}
```

Host app language selector: call `i18n.changeLanguage(value)`; sync to Kit happens via `languageChanged`.

### Persist language across refreshes

In your `i18n.ts`, check localStorage first to avoid losing the selected language on page reload:

```typescript
const customLanguageDetector = {
  name: 'customDetector',
  lookup: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('i18nextLng');
      if (stored && supportedLanguages.includes(stored)) return stored;
    }
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang)) return browserLang;
    return 'en';
  },
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem('i18nextLng', lng);
  },
};
```

### Optional: dayjs locale

If you use dayjs: `i18n.on("languageChanged", (lng) => { dayjs.locale(lng === "tw" ? "zh-tw" : lng) })`.

## Pre-commit and ESLint (missing / unused translations)

### Pre-commit

- **lint-staged:** Often runs ESLint + Prettier on staged `.ts/.tsx` and Prettier on `.json`. No i18n-specific step by default.
- **Unused keys in en.json:** A script can find keys in `en.json` that are never used in code (`t("...")`, `i18nKey="..."`). Run it in pre-commit when translation files or code change (e.g. when `en.json` or any `src/i18n/languages/*.json` is staged). Exit non-zero if unused keys exist so the commit fails.
- **Missing keys in other locales:** Add a script that compares each locale's keys to `en.json` and exits with an error if any key is missing or extra. Run from pre-commit (when i18n files staged) or CI.

### ESLint

- Many projects do **not** use `eslint-plugin-i18next` (or similar). To highlight missing translations: (1) enable an unused-keys script in pre-commit and a "missing keys per locale" script, or (2) add an i18n ESLint plugin and point it at the translation files.

### Summary

| Check | How to enable |
|-------|----------------|
| Unused keys in en.json | Script that scans code for `t("key")` / `i18nKey` and compares to en.json; run in pre-commit or CI |
| Missing/extra keys in other locales | Script that compares each locale JSON to en.json; run in pre-commit or CI |
| ESLint missing keys | Optional: add eslint-plugin-i18next (or similar) and configure |
