import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    Address,
    HexUInt,
    Secp256k1,
    Transaction,
    type TransactionBody,
} from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';
import {
    computeCorrectedGasTokenCost,
    computeCorrectedTotalGasNoFeePayer,
    convertGasToGasTokenAmount,
    decodeRawTx,
    delegateAuthorized,
    estimateAndBuildTxBody,
    estimateGas,
    GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS,
    GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER,
    GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS,
    getDepositAccount,
    signVip191Transaction,
} from './useGenericDelegator';

const SMART_ACCOUNT = '0x1111111111111111111111111111111111111111';
const clauses = [{ to: SMART_ACCOUNT, value: '0x1', data: '0x' }];

const fakeThor = (totalGas: number | Promise<never>) =>
    ({
        gas: {
            estimateGas: vi.fn(() =>
                totalGas instanceof Promise
                    ? totalGas
                    : Promise.resolve({ totalGas, reverted: false }),
            ),
        },
        transactions: {
            buildTransactionBody: vi.fn(
                async (_c: unknown, gas: number, opts: unknown) => ({
                    gas,
                    opts,
                }),
            ),
        },
    } as unknown as ThorClient);

afterEach(() => {
    vi.useRealTimers();
});

describe('convertGasToGasTokenAmount', () => {
    const rate = { transactionCost: 2, estimatedGas: 100_000 }; // 2e-5 token/gas

    it('applies the delegator rate and the per-token fee-payer overhead', () => {
        expect(
            convertGasToGasTokenAmount({
                totalGasNoFeePayer: 50_000,
                gasToken: 'VET',
                estimationResponse: rate,
            }),
        ).toBeCloseTo((50_000 + 21_000) * 2e-5, 10);
        expect(
            convertGasToGasTokenAmount({
                totalGasNoFeePayer: 50_000,
                gasToken: 'VTHO',
                estimationResponse: rate,
            }),
        ).toBeCloseTo((50_000 + 55_000) * 2e-5, 10);
        expect(GENERIC_DELEGATOR_FEE_PAYER_OVERHEAD_GAS.B3TR).toBe(55_000);
    });

    it('falls back to vthoPerGasAtSpeed * rate * (1 + serviceFee)', () => {
        expect(
            convertGasToGasTokenAmount({
                totalGasNoFeePayer: 100_000,
                gasToken: 'VET',
                estimationResponse: {
                    vthoPerGasAtSpeed: 1e-5,
                    rate: 2,
                    serviceFee: 0.1,
                },
            }),
        ).toBeCloseTo(121_000 * 1e-5 * 2 * 1.1, 10);
    });

    it('returns 0 when the response carries no usable rate', () => {
        expect(
            convertGasToGasTokenAmount({
                totalGasNoFeePayer: 100_000,
                gasToken: 'VET',
                estimationResponse: { transactionCost: 2, estimatedGas: 0 },
            }),
        ).toBe(0);
        expect(
            convertGasToGasTokenAmount({
                totalGasNoFeePayer: 100_000,
                gasToken: 'VET',
                estimationResponse: {},
            }),
        ).toBe(0);
    });
});

describe('computeCorrectedTotalGasNoFeePayer', () => {
    it('adds the wrapper overhead for the account version and pads by the safety multiplier', async () => {
        const thor = fakeThor(100_000);
        const v1 = await computeCorrectedTotalGasNoFeePayer({
            thor,
            clauses,
            smartAccountAddress: SMART_ACCOUNT,
            version: 1,
        });
        const v3 = await computeCorrectedTotalGasNoFeePayer({
            thor,
            clauses,
            smartAccountAddress: SMART_ACCOUNT,
            version: 3,
        });
        expect(v1).toBe(Math.ceil((100_000 + 80_000) * 1.1));
        expect(v3).toBe(Math.ceil((100_000 + 120_000) * 1.1));
        expect(GENERIC_DELEGATOR_GAS_SAFETY_MULTIPLIER).toBe(1.1);
        expect(thor.gas.estimateGas).toHaveBeenCalledWith(
            clauses,
            SMART_ACCOUNT,
        );
    });

    it('treats unknown versions (including 0 for not-yet-deployed accounts) as v3', async () => {
        for (const version of [0, 2, 99]) {
            expect(
                await computeCorrectedTotalGasNoFeePayer({
                    thor: fakeThor(100_000),
                    clauses,
                    smartAccountAddress: SMART_ACCOUNT,
                    version,
                }),
            ).toBe(
                Math.ceil(
                    (100_000 + GENERIC_DELEGATOR_WRAPPER_OVERHEAD_GAS[3]) * 1.1,
                ),
            );
        }
    });

    it('returns null when the local estimate fails, is non-positive, or times out', async () => {
        const base = {
            clauses,
            smartAccountAddress: SMART_ACCOUNT,
            version: 3,
        };
        expect(
            await computeCorrectedTotalGasNoFeePayer({
                ...base,
                thor: fakeThor(Promise.reject(new Error('reverted'))),
            }),
        ).toBeNull();
        expect(
            await computeCorrectedTotalGasNoFeePayer({
                ...base,
                thor: fakeThor(0),
            }),
        ).toBeNull();

        vi.useFakeTimers();
        const pending = computeCorrectedTotalGasNoFeePayer({
            ...base,
            thor: fakeThor(new Promise<never>(() => {})),
            timeoutMs: 50,
        });
        await vi.advanceTimersByTimeAsync(60);
        expect(await pending).toBeNull();
    });
});

describe('computeCorrectedGasTokenCost', () => {
    const estimationResponse = { transactionCost: 1, estimatedGas: 100_000 };
    const base = {
        clauses,
        smartAccountAddress: SMART_ACCOUNT,
        version: 3,
        gasToken: 'VET' as const,
        estimationResponse,
    };

    it('reapplies the delegator rate to the locally corrected gas', async () => {
        const totalGas = Math.ceil((100_000 + 120_000) * 1.1) + 21_000;
        expect(
            await computeCorrectedGasTokenCost({
                ...base,
                thor: fakeThor(100_000),
            }),
        ).toBeCloseTo(totalGas * 1e-5, 10);
    });

    it('never pays less than the delegator end-to-end estimate (undeployed account deploy clause)', async () => {
        // local recompute gives ~0.49, delegator already priced createAccount at 3
        expect(
            await computeCorrectedGasTokenCost({
                ...base,
                thor: fakeThor(10_000),
                estimationResponse: {
                    transactionCost: 3,
                    estimatedGas: 1_000_000,
                },
            }),
        ).toBe(3);
    });

    it('falls back to twice the delegator cost when the local estimate is unavailable', async () => {
        expect(
            await computeCorrectedGasTokenCost({ ...base, thor: fakeThor(0) }),
        ).toBe(2);
    });
});

describe('estimateAndBuildTxBody', () => {
    it('estimates with gas padding and builds a delegated body', async () => {
        const thor = fakeThor(60_000);
        const user = { address: SMART_ACCOUNT, privateKey: '0x' } as never;
        const body = await estimateAndBuildTxBody(clauses, thor, user, true);
        expect(thor.gas.estimateGas).toHaveBeenCalledWith(
            clauses,
            SMART_ACCOUNT,
            {
                gasPadding: 1,
            },
        );
        expect(thor.transactions.buildTransactionBody).toHaveBeenCalledWith(
            clauses,
            60_000,
            { isDelegated: true },
        );
        expect(body).toEqual({ gas: 60_000, opts: { isDelegated: true } });
    });
});

describe('VIP-191 assembly', () => {
    const body: TransactionBody = {
        chainTag: 0xf6,
        blockRef: '0x0000000000000000',
        expiration: 32,
        clauses,
        gasPriceCoef: 0,
        gas: 50_000,
        dependsOn: null,
        nonce: 1,
        reserved: { features: 1 },
    };

    it('appends the gas payer signature so origin and gasPayer both recover', async () => {
        const senderKey = await Secp256k1.generatePrivateKey();
        const payerKey = await Secp256k1.generatePrivateKey();
        const sender = Address.ofPrivateKey(senderKey);
        const payer = Address.ofPrivateKey(payerKey);

        const senderSigned = Transaction.of(body).signAsSender(senderKey);
        // A sender-only signature on a delegated tx is incomplete, so `encoded` is
        // the unsigned body: that is what the delegator receives and signs.
        const raw = HexUInt.of(senderSigned.encoded).toString();
        const forDelegator = decodeRawTx(raw, false);
        expect(forDelegator.isDelegated).toBe(true);
        expect(forDelegator.isSigned).toBe(false);
        expect(forDelegator.getTransactionHash().toString()).toBe(
            senderSigned.getTransactionHash().toString(),
        );

        const payerSignature = forDelegator.signAsGasPayer(sender, payerKey)
            .signature as Uint8Array;
        const final = signVip191Transaction(
            senderSigned,
            HexUInt.of(payerSignature.slice(-65)).toString(),
        );
        expect(final.isSigned).toBe(true);
        expect(final.origin.toString()).toBe(sender.toString());
        expect(final.gasPayer.toString()).toBe(payer.toString());
        expect(final.signature).toHaveLength(130);
        expect(Transaction.decode(final.encoded, true).id.toString()).toBe(
            final.id.toString(),
        );
    });
});

describe('generic delegator HTTP contract', () => {
    const base = 'https://delegator.example/api/v1/';
    const mockFetch = (status: number, json: unknown) => {
        const fetch = vi.fn(async () => ({
            ok: status < 400,
            status,
            json: async () => json,
        }));
        vi.stubGlobal('fetch', fetch);
        return fetch;
    };
    afterEach(() => vi.unstubAllGlobals());

    it('estimateGas posts the clauses and signer to estimate/clauses/<token>', async () => {
        const fetch = mockFetch(200, { transactionCost: 1 });
        await expect(
            estimateGas(SMART_ACCOUNT, base, clauses, 'VTHO', 'medium'),
        ).resolves.toEqual({ transactionCost: 1 });
        const [url, init] = fetch.mock.calls[0] as unknown as [
            URL,
            RequestInit,
        ];
        expect(url.toString()).toBe(
            `${base}estimate/clauses/vtho?type=smartaccount&speed=medium`,
        );
        expect(init.method).toBe('POST');
        expect(JSON.parse(init.body as string)).toEqual({
            clauses,
            signer: SMART_ACCOUNT,
        });
    });

    it('getDepositAccount reads deposit/account', async () => {
        const fetch = mockFetch(200, { depositAccount: SMART_ACCOUNT });
        await expect(getDepositAccount(base)).resolves.toEqual({
            depositAccount: SMART_ACCOUNT,
        });
        expect((fetch.mock.calls[0] as unknown as [URL])[0].toString()).toBe(
            `${base}deposit/account`,
        );
    });

    it('delegateAuthorized returns the gas payer signature on success', async () => {
        const fetch = mockFetch(200, {
            signature: '0xabc',
            address: SMART_ACCOUNT,
        });
        await expect(
            delegateAuthorized('0xraw', SMART_ACCOUNT, 'B3TR', base),
        ).resolves.toEqual({ signature: '0xabc', address: SMART_ACCOUNT });
        const [url, init] = fetch.mock.calls[0] as unknown as [
            URL,
            RequestInit,
        ];
        expect(url.toString()).toBe(`${base}sign/transaction/authorized/b3tr`);
        expect(JSON.parse(init.body as string)).toEqual({
            raw: '0xraw',
            origin: SMART_ACCOUNT,
            token: 'b3tr',
        });
    });

    it('delegateAuthorized surfaces delegator rejections instead of returning the error body', async () => {
        mockFetch(500, { message: 'Transfer not received' });
        await expect(
            delegateAuthorized('0xraw', SMART_ACCOUNT, 'VET', base),
        ).rejects.toThrow(
            'Generic delegator rejected the transaction (HTTP 500): Transfer not received',
        );

        mockFetch(200, { error: 'no signature here' });
        await expect(
            delegateAuthorized('0xraw', SMART_ACCOUNT, 'VET', base),
        ).rejects.toThrow('HTTP 200');
    });
});
