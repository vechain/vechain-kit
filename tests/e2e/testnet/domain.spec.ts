import { expect, test } from '@playwright/test';
import {
    MISSING_CREDENTIALS,
    accounts,
    approvePrivySignature,
    expectSmartAccountTx,
    nextBroadcastTxId,
    openAccountModal,
    privyCredentials,
} from '../fixtures/privy';

test.skip(!privyCredentials(), MISSING_CREDENTIALS);

test('a fresh .veworld.vet subdomain is claimed through the account modal', async ({
    page,
}) => {
    const name = `e2e${Date.now().toString(36)}`;
    await openAccountModal(page);
    const addresses = await accounts(page);

    await page.getByTestId('profile-avatar').click();
    await page.getByTestId('set-domain-name-button').click();
    const chooseName = page.getByTestId('choose-name-button');
    const input = page.getByTestId('domain-input');
    await expect(chooseName.or(input)).toBeVisible();
    // Accounts without a name see an intro step first.
    if (await chooseName.isVisible()) await chooseName.click();

    await input.fill(name);
    await expect(page.getByTestId('domain-availability-status')).toHaveText(
        'AVAILABLE',
    );
    await page.getByTestId('continue-button').click();
    await expect(page.getByTestId('preconfirm-domain-val')).toHaveText(
        `${name}.veworld.vet`,
    );

    const txId = nextBroadcastTxId(page);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await approvePrivySignature(page);
    await expect(page.getByText('Domain set')).toBeVisible({
        timeout: 120_000,
    });
    await expectSmartAccountTx(await txId, addresses);
});
