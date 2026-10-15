import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
    encodeFunctionData,
    erc20Abi,
    hashTypedData,
    isHex,
    verifyTypedData,
} from 'viem';
import type { TransactionClause } from '@vechain/sdk-core';
import {
    buildBatchAuthorizationTypedData,
    buildSingleAuthorizationTypedData,
} from './useBuildClauses';

// Mainnet genesis block id: the kit uses it as the EIP-712 chainId (hex string at runtime).
const MAINNET_CHAIN_ID =
    '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a' as unknown as number;
const SMART_ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECIPIENT = '0x2222222222222222222222222222222222222222';
const TOKEN = '0x3333333333333333333333333333333333333333';
const NOW = new Date('2026-01-01T00:00:00Z');

const vetClause: TransactionClause = {
    to: RECIPIENT,
    value: '0xde0b6b3a7640000',
    data: '0x',
};
const erc20Clause = {
    to: TOKEN,
    value: 0,
    data: {
        abi: erc20Abi,
        functionName: 'transfer',
        args: [RECIPIENT, 1_000_000n],
    },
} as unknown as TransactionClause;
const erc20Calldata = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [RECIPIENT, 1_000_000n],
});

beforeEach(() => {
    vi.useFakeTimers({ now: NOW });
});
afterEach(() => {
    vi.useRealTimers();
});

describe('buildSingleAuthorizationTypedData (smart account v1)', () => {
    const build = (clause: TransactionClause) =>
        buildSingleAuthorizationTypedData({
            clause,
            chainId: MAINNET_CHAIN_ID,
            smartAccount: { address: SMART_ACCOUNT, isDeployed: true },
        });

    it('targets the smart account with the Wallet/1 domain', () => {
        const data = build(vetClause);
        expect(data.domain).toEqual({
            name: 'Wallet',
            version: '1',
            chainId: MAINNET_CHAIN_ID,
            verifyingContract: SMART_ACCOUNT,
        });
        expect(data.primaryType).toBe('ExecuteWithAuthorization');
        expect(data.types.ExecuteWithAuthorization).toEqual([
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'data', type: 'bytes' },
            { name: 'validAfter', type: 'uint256' },
            { name: 'validBefore', type: 'uint256' },
        ]);
    });

    it('carries the clause with a 60 second validity window', () => {
        const data = build(vetClause);
        expect(data.message).toEqual({
            to: RECIPIENT,
            value: '0xde0b6b3a7640000',
            data: '0x',
            validAfter: 0,
            validBefore: Math.floor(NOW.getTime() / 1000) + 60,
        });
    });

    it('encodes abi-shaped clause data and defaults missing data to 0x', () => {
        expect(build(erc20Clause).message.data).toBe(erc20Calldata);
        expect(
            build({
                to: RECIPIENT,
                value: 1,
                data: undefined as unknown as string,
            }).message.data,
        ).toBe('0x');
        expect(build({ to: RECIPIENT, value: 1, data: '' }).message.data).toBe(
            '0x',
        );
    });

    it('produces a stable EIP-712 digest for a given clause and time', () => {
        const data = build(erc20Clause);
        const digest = hashTypedData(data as never);
        expect(digest).toBe(
            '0x4883f0aa7325d943c18f961db450cdef2e5a962882a54a19fca37459a354aefe',
        );
    });

    it('is signable by an embedded wallet and verifies against the same payload', async () => {
        const owner = privateKeyToAccount(generatePrivateKey());
        const data = build(erc20Clause);
        const signature = await owner.signTypedData(data as never);
        await expect(
            verifyTypedData({
                ...data,
                address: owner.address,
                signature,
            } as never),
        ).resolves.toBe(true);
    });
});

describe('buildBatchAuthorizationTypedData (smart account v3)', () => {
    const build = (clauses: TransactionClause[]) =>
        buildBatchAuthorizationTypedData({
            clauses,
            chainId: MAINNET_CHAIN_ID,
            verifyingContract: SMART_ACCOUNT,
        });

    it('uses the batch primary type with array fields and a nonce', () => {
        const data = build([vetClause]);
        expect(data.domain).toEqual({
            name: 'Wallet',
            version: '1',
            chainId: MAINNET_CHAIN_ID,
            verifyingContract: SMART_ACCOUNT,
        });
        expect(data.primaryType).toBe('ExecuteBatchWithAuthorization');
        expect(data.types.ExecuteBatchWithAuthorization).toEqual([
            { name: 'to', type: 'address[]' },
            { name: 'value', type: 'uint256[]' },
            { name: 'data', type: 'bytes[]' },
            { name: 'validAfter', type: 'uint256' },
            { name: 'validBefore', type: 'uint256' },
            { name: 'nonce', type: 'bytes32' },
        ]);
    });

    it('keeps to/value/data arrays aligned with the input clauses', () => {
        const data = build([vetClause, erc20Clause]);
        expect(data.message.to).toEqual([RECIPIENT, TOKEN]);
        expect(data.message.value).toEqual(['0xde0b6b3a7640000', '0']);
        expect(data.message.data).toEqual(['0x', erc20Calldata]);
        expect(data.message.validAfter).toBe(0);
        expect(data.message.validBefore).toBe(
            Math.floor(NOW.getTime() / 1000) + 300,
        );
    });

    it('maps a missing recipient to an empty string and missing data to 0x', () => {
        const data = build([{ to: null, value: 0, data: '' }]);
        expect(data.message.to).toEqual(['']);
        expect(data.message.data).toEqual(['0x']);
    });

    it('uses a fresh random 32-byte nonce per call', () => {
        const a = build([vetClause]).message.nonce;
        const b = build([vetClause]).message.nonce;
        expect(isHex(a)).toBe(true);
        expect(a).toHaveLength(66);
        expect(a).not.toBe(b);
    });

    it('is signable by an embedded wallet and verifies against the same payload', async () => {
        const owner = privateKeyToAccount(generatePrivateKey());
        const data = build([vetClause, erc20Clause]);
        const signature = await owner.signTypedData(data as never);
        await expect(
            verifyTypedData({
                ...data,
                address: owner.address,
                signature,
            } as never),
        ).resolves.toBe(true);
        const other = privateKeyToAccount(generatePrivateKey());
        await expect(
            verifyTypedData({
                ...data,
                address: other.address,
                signature,
            } as never),
        ).resolves.toBe(false);
    });
});
