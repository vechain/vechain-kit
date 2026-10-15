import { expect, test } from '@playwright/test';
import {
    MISSING_CREDENTIALS,
    accounts,
    loginWithEmail,
    privyCredentials,
} from '../fixtures/privy';

test.skip(!privyCredentials(), MISSING_CREDENTIALS);

test('the saved Privy session is restored with its smart account', async ({
    page,
}) => {
    await page.goto('/');
    await expect(page.getByTestId('connection-type')).toContainText('privy');
    await expect(page.getByTestId('network')).toContainText('test');
    const { owner, smartAccount } = await accounts(page);
    expect(smartAccount).not.toBe(owner);
});

test.describe('without a saved session', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('email login, then logout clears the Privy session', async ({
        page,
    }) => {
        await loginWithEmail(page, privyCredentials()!);
        await accounts(page);

        await page.getByTestId('wallet-button').click();
        await page.getByTestId('settings-button').click();
        await page.getByRole('button', { name: /Logout/ }).click();
        await page.getByTestId('disconnect-button').click();

        await expect(
            page.getByRole('button', { name: 'Login', exact: true }).first(),
        ).toBeVisible();
        await expect(page.getByTestId('connection-type')).toHaveCount(0);
        const keys = await page.evaluate(() => Object.keys(localStorage));
        expect(keys.filter((k) => k.startsWith('privy:token'))).toEqual([]);
    });
});
