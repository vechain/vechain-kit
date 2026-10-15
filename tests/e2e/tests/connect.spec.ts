import {
    expect,
    humanAddress,
    loginWithVeWorld,
    test,
} from '../fixtures/veworld';

test('the app loads without uncaught errors', async ({ page, pageErrors }) => {
    await page.goto('/');
    await expect(
        page.getByRole('button', { name: 'Login', exact: true }).first(),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
});

test('VeWorld login shows the wallet, logout clears the session', async ({
    page,
    wallet,
    pageErrors,
}) => {
    const address = await loginWithVeWorld(page);
    await expect(address).toHaveText(humanAddress(wallet.address));
    await expect(page.getByTestId('connection-type')).toContainText('wallet');
    await expect(page.getByTestId('network')).toContainText('solo');
    await expect(page.getByTestId('connected-wallet-address')).toContainText(
        wallet.address.toLowerCase(),
    );
    expect(wallet.methods()).toContain('eth_requestAccounts');

    await page.getByTestId('wallet-button').click();
    await page.getByTestId('settings-button').click();
    await page.getByRole('button', { name: /Logout/ }).click();
    await page.getByTestId('disconnect-button').click();

    await expect(
        page.getByRole('button', { name: 'Login', exact: true }).first(),
    ).toBeVisible();
    // Only the T&C acceptance record may remember the address after logout.
    const stored = await page.evaluate(() => Object.entries(localStorage));
    const leftovers = stored.filter(
        ([key, value]) =>
            key !== 'vechain-kit-legal-documents' &&
            value.toLowerCase().includes(wallet.address.slice(2).toLowerCase()),
    );
    expect(leftovers).toEqual([]);
    expect(pageErrors).toEqual([]);
});

test('a rejected connection request leaves the user logged out', async ({
    page,
    wallet,
}) => {
    await page.goto('/');
    wallet.rejectNextRequest('User rejected the request');
    await page
        .getByRole('button', { name: 'Login', exact: true })
        .first()
        .click();
    await page.getByRole('button', { name: /VeWorld/ }).click();
    await expect(page.getByTestId('trimmed-address')).toHaveCount(0);
    const dialog = page.getByRole('dialog', { name: 'Log in or sign up' });
    await expect(dialog.getByRole('button', { name: /VeWorld/ })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(
        page.getByRole('button', { name: 'Login', exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByTestId('trimmed-address')).toHaveCount(0);
});

test('the session survives a reload', async ({ page, wallet }) => {
    await loginWithVeWorld(page);
    await page.reload();
    await expect(page.getByTestId('trimmed-address')).toHaveText(
        humanAddress(wallet.address),
    );
});
