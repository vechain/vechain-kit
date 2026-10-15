import { defineConfig, devices } from '@playwright/test';
import { PRIVY_AUTH_FILE } from './fixtures/privy';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
    fullyParallel: false,
    workers: 1,
    retries: 0,
    forbidOnly: !!process.env.CI,
    timeout: 90_000,
    expect: { timeout: 30_000 },
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never' }]]
        : [['list']],
    use: {
        baseURL,
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'solo',
            testDir: './tests',
            use: { ...devices['Desktop Chrome'] },
        },
        // Traces and setup screenshots would capture the Privy test code and session tokens.
        {
            name: 'testnet-setup',
            testDir: './testnet',
            testMatch: /\.setup\.ts$/,
            timeout: 240_000,
            use: {
                ...devices['Desktop Chrome'],
                trace: 'off',
                screenshot: 'off',
            },
        },
        {
            name: 'testnet',
            testDir: './testnet',
            dependencies: ['testnet-setup'],
            timeout: 240_000,
            use: {
                ...devices['Desktop Chrome'],
                storageState: PRIVY_AUTH_FILE,
                trace: 'off',
            },
        },
    ],
    webServer: {
        command: 'node serve-static.mjs ../../examples/next-template/dist 3000',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
