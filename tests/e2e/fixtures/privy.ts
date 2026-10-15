import { expect, type Locator, type Page } from '@playwright/test';
import { Address } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import {
    SocialLoginSmartAccountFactory__factory,
    SocialLoginSmartAccount__factory,
} from '@vechain/vechain-contract-types';
import { fileURLToPath } from 'node:url';
import { getAbiItem, toFunctionSelector, type Abi } from 'viem';

export const TESTNET_NODE_URL = 'https://testnet.vechain.org';
export const TESTNET_ACCOUNT_FACTORY =
    '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF';
export const PRIVY_AUTH_FILE = fileURLToPath(
    new URL('../.auth/privy.json', import.meta.url),
);
export const MISSING_CREDENTIALS =
    'E2E_PRIVY_TEST_EMAIL and E2E_PRIVY_TEST_CODE are not set';

export const testnet = ThorClient.at(TESTNET_NODE_URL);

export const privyCredentials = () => {
    const email = process.env.E2E_PRIVY_TEST_EMAIL;
    const code = process.env.E2E_PRIVY_TEST_CODE;
    return email && code ? { email, code } : null;
};

export const loginWithEmail = async (
    page: Page,
    { email, code }: { email: string; code: string },
) => {
    await page.goto('/');
    await page
        .getByRole('button', { name: 'Login', exact: true })
        .first()
        .click();
    await page.getByRole('button', { name: 'More options' }).click();
    await setInputValue(page.getByTestId('email-login-input'), email);
    await page.getByTestId('email-login-submit').click();
    // Chakra spreads a full code typed into the first field across all six.
    await setInputValue(
        page.getByTestId('email-code-input').getByRole('textbox').first(),
        code,
    );
    try {
        await page.getByTestId('accept-tnc-button').click();
        await expect(page.getByTestId('connection-type')).toContainText(
            'privy',
        );
    } catch (error) {
        // The failure snapshot and screenshot would show the code in the PIN fields.
        await page.goto('about:blank');
        throw error;
    }
};

// fill() and type() put the value in report step titles; evaluate() does not.
const setInputValue = (input: Locator, value: string) =>
    input.evaluate((el: HTMLInputElement, v: string) => {
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        )!.set!.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }, value);

const addressIn = async (page: Page, testId: string) => {
    const text = await page.getByTestId(testId).textContent();
    const match = text?.match(/0x[0-9a-fA-F]{40}/);
    if (!match) throw new Error(`no address in ${testId}: ${text}`);
    return match[0].toLowerCase();
};

export const accounts = async (page: Page) => {
    await expect(page.getByTestId('smart-account-address')).toContainText(
        /0x[0-9a-fA-F]{40}/,
    );
    return {
        owner: await addressIn(page, 'connected-wallet-address'),
        smartAccount: await addressIn(page, 'smart-account-address'),
    };
};

export const openAccountModal = async (page: Page) => {
    await page.goto('/');
    await expect(page.getByTestId('connection-type')).toContainText('privy');
    await page.getByTestId('wallet-button').click();
};

// Privy renders its own modal for embedded-wallet signatures and the key export.
export const privyModal = (page: Page) => page.locator('#privy-modal-content');

export const approvePrivySignature = async (page: Page) => {
    await privyModal(page)
        .getByRole('button', { name: /^(Sign|Approve|Confirm)\b/ })
        .click();
};

export const closePrivyModal = async (page: Page) => {
    await privyModal(page)
        .getByRole('button', { name: /close/i })
        .first()
        .click();
    await expect(privyModal(page)).toBeHidden();
};

export const nextBroadcastTxId = (page: Page) =>
    page
        .waitForResponse(
            (r) =>
                r.request().method() === 'POST' &&
                r.url().replace(/\/+$/, '') ===
                    `${TESTNET_NODE_URL}/transactions`,
            { timeout: 120_000 },
        )
        .then(async (r) => ((await r.json()) as { id: string }).id);

export const vetBalance = async (address: string) =>
    BigInt((await testnet.accounts.getAccount(Address.of(address))).balance);

const selector = (abi: Abi, name: string) =>
    toFunctionSelector(getAbiItem({ abi, name }) as never);

/**
 * Asserts the shape of a smart-account transaction: sent by a throwaway
 * origin, fee delegated, executing on the smart account (plus the account
 * deployment on its very first transaction).
 */
export const expectSmartAccountTx = async (
    txId: string,
    { owner, smartAccount }: { owner: string; smartAccount: string },
) => {
    const receipt = await testnet.transactions.waitForTransaction(txId, {
        timeoutMs: 120_000,
    });
    expect(receipt, `receipt of ${txId}`).not.toBeNull();
    expect(receipt!.reverted).toBe(false);
    const origin = receipt!.meta.txOrigin?.toLowerCase();
    expect(origin).toMatch(/^0x[0-9a-f]{40}$/);
    expect([owner, smartAccount]).not.toContain(origin);
    expect(receipt!.gasPayer?.toLowerCase()).not.toBe(origin);

    const execute = selector(
        SocialLoginSmartAccount__factory.abi as Abi,
        'executeBatchWithAuthorization',
    );
    const create = selector(
        SocialLoginSmartAccountFactory__factory.abi as Abi,
        'createAccount',
    );
    const tx = await testnet.transactions.getTransaction(txId);
    const shape = tx!.clauses.map(({ to, data }) => {
        if (to?.toLowerCase() === smartAccount && data.startsWith(execute))
            return 'execute';
        if (
            to?.toLowerCase() === TESTNET_ACCOUNT_FACTORY.toLowerCase() &&
            data.startsWith(create)
        )
            return 'create';
        return `other:${to}`;
    });
    expect([['execute'], ['create', 'execute']]).toContainEqual(shape);
};
