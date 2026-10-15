import { Certificate } from '@vechain/sdk-core';
import { expect, loginWithVeWorld, test } from '../fixtures/veworld';

test.beforeEach(async ({ page }) => {
    await loginWithVeWorld(page);
});

test('sign message goes through a VeWorld certificate that verifies', async ({
    page,
    wallet,
}) => {
    await page.getByTestId('sign-message-button').click();
    const shown = page
        .getByTestId('sign-message-button')
        .locator('xpath=following-sibling::code');
    await expect(shown).toHaveText(/^0x[0-9a-f]{130}$/);

    const call = [...wallet.calls]
        .reverse()
        .find((c) => c.method === 'thor_signCertificate');
    const [message] = call?.params as [
        { purpose: string; payload: { type: string; content: string } },
    ];
    expect(message).toEqual({
        purpose: 'agreement',
        payload: { type: 'text', content: 'Hello VeChain!' },
    });

    const signature = await shown.textContent();
    const certificate = wallet.certificates.at(-1);
    expect(signature).toBe(certificate?.signature);
    expect(certificate?.domain).toBe('localhost');
    expect(() => Certificate.of(certificate!).verify()).not.toThrow();
});

test('sign typed data returns the signature produced by the wallet', async ({
    page,
    wallet,
}) => {
    await page.getByTestId('sign-typed-data-button').click();
    const shown = page
        .getByTestId('sign-typed-data-button')
        .locator('xpath=following-sibling::code');
    await expect(shown).toHaveText(/^0x[0-9a-f]{130}$/);
    expect(await shown.textContent()).toBe(wallet.signatures.at(-1));
    const call = [...wallet.calls]
        .reverse()
        .find((c) => c.method === 'thor_signTypedData');
    expect((call?.params as { genesisId: string }).genesisId).toMatch(
        /^0x[0-9a-f]{64}$/,
    );
});
