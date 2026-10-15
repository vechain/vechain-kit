import { fileURLToPath } from 'node:url';
import { defineConfig, type ViteUserConfig } from 'vitest/config';

const kitDir = fileURLToPath(
    new URL('./packages/vechain-kit', import.meta.url),
);

// Mirrors packages/vechain-kit/tsconfig.json "paths".
const kitAlias: NonNullable<ViteUserConfig['resolve']>['alias'] = [
    { find: /^@\/(.*)$/, replacement: `${kitDir}/src/$1` },
    {
        find: /^@common(\/.*)?$/,
        replacement: `${kitDir}/src/components/common$1`,
    },
    {
        find: /^@(components|hooks|utils|theme|contracts|assets|providers)(\/.*)?$/,
        replacement: `${kitDir}/src/$1$2`,
    },
    { find: /^@i18n$/, replacement: `${kitDir}/i18n.ts` },
];

export default defineConfig({
    test: {
        projects: [
            {
                resolve: { alias: kitAlias },
                esbuild: { jsx: 'automatic' },
                test: {
                    name: 'kit',
                    root: kitDir,
                    environment: 'happy-dom',
                    environmentOptions: {
                        happyDOM: { url: 'http://localhost/' },
                    },
                    include: [
                        'src/**/*.test.{ts,tsx}',
                        'test/**/*.test.{ts,tsx}',
                    ],
                    setupFiles: ['test/setup.ts'],
                    testTimeout: 20_000,
                    onConsoleLog: (log) =>
                        !/connex-wallet-buddy\] v|Lit is in dev mode|PrivyWalletProvider\.request/.test(
                            log,
                        ),
                    server: {
                        deps: {
                            // ESM dists that import CJS named exports; Node refuses, Vite transforms.
                            inline: [/@vechain\/dapp-kit/],
                        },
                    },
                },
            },
            {
                test: {
                    name: 'lambda',
                    root: fileURLToPath(new URL('./lambda', import.meta.url)),
                    environment: 'node',
                    include: ['tests/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'scripts',
                    environment: 'node',
                    include: ['scripts/**/*.test.mjs'],
                },
            },
        ],
        coverage: {
            provider: 'v8',
            reportsDirectory: 'coverage',
            reporter: ['text-summary', 'json-summary', 'lcov'],
            include: [
                'packages/vechain-kit/src/**',
                'lambda/index.ts',
                'scripts/*.mjs',
            ],
            exclude: [
                '**/*.test.*',
                '**/*.d.ts',
                '**/*.md',
                'packages/vechain-kit/src/assets/**',
                'packages/vechain-kit/src/languages/**',
                'packages/vechain-kit/src/contracts/**',
            ],
            // Floors on the regression hot spots this suite covers; no global number
            // because at low overall coverage one would be noise. See docs/testing.md.
            thresholds: {
                'packages/vechain-kit/src/hooks/utils/useBuildClauses.ts': {
                    lines: 85,
                    functions: 85,
                },
                'packages/vechain-kit/src/hooks/generic-delegator/useGenericDelegator.ts':
                    {
                        lines: 85,
                        functions: 85,
                    },
                'packages/vechain-kit/src/providers/VeChainKitProvider.tsx': {
                    lines: 70,
                    functions: 60,
                },
                'packages/vechain-kit/src/providers/PrivyWalletProvider.tsx': {
                    lines: 85,
                    functions: 85,
                },
            },
        },
    },
});
