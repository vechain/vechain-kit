import { expect, loginWithVeWorld, test } from '../fixtures/veworld';

test.beforeEach(async ({ page }) => {
    await loginWithVeWorld(page);
});

const lastTxOptions = (wallet: {
    calls: Array<{ method: string; params?: unknown }>;
}) => {
    const call = [...wallet.calls]
        .reverse()
        .find((c) => c.method === 'thor_sendTransaction');
    return (
        call?.params as [
            unknown,
            { signer?: string; gas?: number; delegator?: unknown },
        ]
    )?.[1];
};

test('a transaction with toast is signed by VeWorld and confirmed on chain', async ({
    page,
    wallet,
}) => {
    await page.getByTestId('tx-with-toast-button').first().click();
    await expect(page.getByTestId('success-icon-toast')).toBeVisible();

    expect(wallet.txIds).toHaveLength(1);
    const receipt = await wallet.thor.transactions.waitForTransaction(
        wallet.txIds[0],
    );
    expect(receipt?.reverted).toBe(false);
    expect(receipt?.meta.txOrigin?.toLowerCase()).toBe(
        wallet.address.toLowerCase(),
    );

    const options = lastTxOptions(wallet);
    expect(options?.signer?.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(options?.gas).toBeGreaterThan(0);
    expect(options?.delegator).toBeUndefined();
});

test('a transaction with modal reports success and can be closed', async ({
    page,
    wallet,
}) => {
    await page.getByTestId('tx-with-modal-button').first().click();
    await expect(page.getByText('Operation successful')).toBeVisible();
    expect(wallet.txIds).toHaveLength(1);
    await page
        .getByRole('dialog')
        .getByRole('button', { name: 'Close' })
        .first()
        .click();
    await expect(page.getByText('Operation successful')).toHaveCount(0);
});

test('a rejected signature is reported, nothing is broadcast', async ({
    page,
    wallet,
    pageErrors,
}) => {
    wallet.rejectNextRequest('User rejected');
    await page.getByTestId('tx-with-modal-button').first().click();
    await expect(page.getByTestId('success-icon-toast')).toHaveCount(0);
    await expect(page.getByText('Operation successful')).toHaveCount(0);
    await expect(page.getByText(/rejected/i).first()).toBeVisible();
    expect(wallet.txIds).toHaveLength(0);
    expect(pageErrors).toEqual([]);
});
