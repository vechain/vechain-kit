import { expect, test } from '@playwright/test';
import {
    MISSING_CREDENTIALS,
    closePrivyModal,
    openAccountModal,
    privyCredentials,
    privyModal,
} from '../fixtures/privy';

test.skip(!privyCredentials(), MISSING_CREDENTIALS);

test('Backup opens Privy key export, closed without revealing the key', async ({
    page,
}) => {
    await openAccountModal(page);
    await page.getByTestId('settings-button').click();
    await page.getByRole('button', { name: /Backup/ }).click();
    await expect(privyModal(page)).toBeVisible();
    await closePrivyModal(page);
});
