import { test as base, type Page } from '@playwright/test';
import { Certificate, HexUInt, Transaction } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { privateKeyToAccount } from 'viem/accounts';

export const NODE_URL = process.env.E2E_NODE_URL ?? 'http://localhost:8669';

// thor solo genesis accounts (public dev keys, pre-funded with VET and VTHO).
export const SOLO_ACCOUNTS = [
    {
        address: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
        privateKey:
            '0x99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36',
    },
    {
        address: '0x0F872421Dc479F3c11eDd89512731814D0598dB5',
        privateKey:
            '0xf4a1a17039216f535d42ec23732c79943ffb45a089fbb78a14daad0dae93e991',
    },
];

export type WalletCall = { method: string; params?: unknown };

type Clause = { to?: string | null; value?: string | number; data?: string };

/**
 * A VeWorld extension stand-in speaking dapp-kit's v2 `window.vechain.request`
 * API. The page only sees a thin shim; signing and broadcasting happen here in
 * Node with a thor-solo key, so every transaction really lands on the chain.
 */
export const createWallet = (accountIndex = 0) => {
    const account = SOLO_ACCOUNTS[accountIndex];
    const key = HexUInt.of(account.privateKey.slice(2)).bytes;
    const viemAccount = privateKeyToAccount(
        account.privateKey as `0x${string}`,
    );
    const thor = ThorClient.at(NODE_URL);
    const calls: WalletCall[] = [];
    const txIds: string[] = [];
    const signatures: string[] = [];
    const certificates: Array<{
        purpose: string;
        payload: { type: string; content: string };
        domain: string;
        timestamp: number;
        signer: string;
        signature: string;
    }> = [];
    let rejectNext: string | null = null;

    const request = async (
        { method, params }: WalletCall,
        hostname: string,
    ): Promise<unknown> => {
        calls.push({ method, params });
        if (rejectNext) {
            const reason = rejectNext;
            rejectNext = null;
            throw new Error(reason);
        }
        switch (method) {
            case 'eth_accounts':
            case 'eth_requestAccounts':
                return [account.address];
            case 'wallet_requestPermissions':
                return [
                    {
                        parentCapability: 'eth_accounts',
                        caveats: [
                            {
                                type: 'restrictReturnedAccounts',
                                value: [account.address],
                            },
                        ],
                    },
                ];
            case 'wallet_revokePermissions':
            case 'wallet_revokeAccountPermission':
                return null;
            case 'thor_signCertificate': {
                const [message] = params as [
                    {
                        purpose: string;
                        payload: { type: string; content: string };
                    },
                ];
                const timestamp = Math.floor(Date.now() / 1000);
                const annex = {
                    domain: hostname,
                    timestamp,
                    signer: account.address,
                };
                const certificate = Certificate.of({
                    ...message,
                    ...annex,
                }).sign(key);
                signatures.push(certificate.signature as string);
                certificates.push({
                    ...message,
                    ...annex,
                    signature: certificate.signature as string,
                });
                return { annex, signature: certificate.signature };
            }
            case 'thor_signTypedData': {
                const { domain, types, value } = params as {
                    domain: Record<string, unknown>;
                    types: Record<
                        string,
                        Array<{ name: string; type: string }>
                    >;
                    value: Record<string, unknown>;
                };
                const referenced = new Set(
                    Object.values(types).flatMap((fields) =>
                        fields.map((f) => f.type.replace(/\[\]$/, '')),
                    ),
                );
                const primaryType = Object.keys(types).find(
                    (t) => t !== 'EIP712Domain' && !referenced.has(t),
                );
                const signature = await viemAccount.signTypedData({
                    domain,
                    types,
                    primaryType: primaryType as string,
                    message: value,
                } as never);
                signatures.push(signature);
                return signature;
            }
            case 'thor_sendTransaction': {
                const [message, options] = params as [
                    Clause[],
                    { gas?: number },
                ];
                const clauses = message.map((c) => ({
                    to: c.to ?? null,
                    value: c.value ?? 0,
                    data: c.data ?? '0x',
                }));
                const gas =
                    options?.gas ||
                    (await thor.gas.estimateGas(clauses, account.address))
                        .totalGas;
                const body = await thor.transactions.buildTransactionBody(
                    clauses,
                    gas,
                );
                const signed = Transaction.of(body).sign(key);
                const { id } = await thor.transactions.sendTransaction(signed);
                txIds.push(id);
                return { txid: id, signer: account.address };
            }
            default:
                throw new Error(`veworld shim: unsupported method ${method}`);
        }
    };

    return {
        address: account.address,
        thor,
        calls,
        txIds,
        signatures,
        certificates,
        request,
        rejectNextRequest: (reason = 'User rejected') => {
            rejectNext = reason;
        },
        methods: () => calls.map((c) => c.method),
    };
};

export type Wallet = ReturnType<typeof createWallet>;

export const test = base.extend<{ wallet: Wallet; pageErrors: Error[] }>({
    wallet: [
        async ({ context }, use) => {
            const wallet = createWallet(0);
            await context.exposeFunction(
                '__veworldRequest',
                (args: WalletCall, hostname: string) =>
                    wallet.request(args, hostname),
            );
            await context.addInitScript(() => {
                (window as unknown as { vechain: unknown }).vechain = {
                    isVeWorld: true,
                    isInAppBrowser: false,
                    request: (args: unknown) =>
                        (
                            window as unknown as {
                                __veworldRequest: (
                                    a: unknown,
                                    h: string,
                                ) => Promise<unknown>;
                            }
                        ).__veworldRequest(args, window.location.hostname),
                };
            });
            await use(wallet);
        },
        { auto: true },
    ],
    pageErrors: async ({ page }, use) => {
        const errors: Error[] = [];
        page.on('pageerror', (error) => errors.push(error));
        await use(errors);
    },
});

export { expect } from '@playwright/test';

export const humanAddress = (address: string) =>
    `${address.slice(0, 4)}•••${address.slice(-4)}`;

export const loginWithVeWorld = async (page: Page) => {
    await page.goto('/');
    await page
        .getByRole('button', { name: 'Login', exact: true })
        .first()
        .click();
    await page.getByRole('button', { name: /VeWorld/ }).click();
    await page.getByTestId('accept-tnc-button').click();
    await page.getByTestId('trimmed-address').waitFor();
    return page.getByTestId('trimmed-address');
};
