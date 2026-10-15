import { expect, test as setup } from '@playwright/test';
import {
    MISSING_CREDENTIALS,
    PRIVY_AUTH_FILE,
    accounts,
    loginWithEmail,
    privyCredentials,
} from '../fixtures/privy';

setup.skip(!privyCredentials(), MISSING_CREDENTIALS);

setup('log in with the Privy test account', async ({ page }) => {
    await loginWithEmail(page, privyCredentials()!);
    await expect(page.getByTestId('network')).toContainText('test');
    const { smartAccount } = await accounts(page);
    setup.info().annotations.push({
        type: 'smart account (fund with testnet VET)',
        description: smartAccount,
    });
    await page
        .context()
        .storageState({ path: PRIVY_AUTH_FILE, indexedDB: true });
});
