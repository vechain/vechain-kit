import { expect, test } from '@playwright/test';
import {
    MISSING_CREDENTIALS,
    accounts,
    approvePrivySignature,
    expectSmartAccountTx,
    nextBroadcastTxId,
    privyCredentials,
    vetBalance,
} from '../fixtures/privy';

test.skip(!privyCredentials(), MISSING_CREDENTIALS);

test('a smart-account transaction is signed in Privy and confirmed on testnet', async ({
    page,
}) => {
    await page.goto('/');
    const addresses = await accounts(page);
    expect(
        await vetBalance(addresses.smartAccount),
        `fund ${addresses.smartAccount} at https://faucet.vecha.in`,
    ).toBeGreaterThan(0n);

    const txId = nextBroadcastTxId(page);
    await page.getByTestId('tx-with-toast-button').first().click();
    await approvePrivySignature(page);
    await expect(page.getByTestId('success-icon-toast')).toBeVisible({
        timeout: 120_000,
    });
    await expectSmartAccountTx(await txId, addresses);
    await expect(page.getByTestId('is-sa-deployed')).toContainText('true');
});
