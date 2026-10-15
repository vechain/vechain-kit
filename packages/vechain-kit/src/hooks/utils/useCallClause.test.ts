import { describe, expect, it } from 'vitest';
import { erc20Abi } from 'viem';
import {
    getCallClauseQueryKey,
    getCallClauseQueryKeyWithArgs,
} from './useCallClause';

const TOKEN = '0x3333333333333333333333333333333333333333';
const OWNER = '0x2222222222222222222222222222222222222222';

describe('call clause query keys', () => {
    it('keys on address and method, then the args', () => {
        expect(
            getCallClauseQueryKey({
                abi: erc20Abi,
                address: TOKEN,
                method: 'name',
            }),
        ).toEqual(['callClause', TOKEN, 'name']);
        expect(
            getCallClauseQueryKeyWithArgs({
                abi: erc20Abi,
                address: TOKEN,
                method: 'balanceOf',
                args: [OWNER],
            }),
        ).toEqual(['callClause', TOKEN, 'balanceOf', OWNER]);
        expect(
            getCallClauseQueryKeyWithArgs({
                abi: erc20Abi,
                address: TOKEN,
                method: 'name',
                args: [],
            }),
        ).toEqual(['callClause', TOKEN, 'name']);
    });

    it('serializes BigInt args (top level, nested arrays and object fields) so the key is JSON-safe', () => {
        const key = getCallClauseQueryKeyWithArgs({
            abi: erc20Abi,
            address: TOKEN,
            method: 'allowance',
            args: [OWNER, TOKEN],
        }) as unknown[];
        const withBigInts = [
            ...key,
            ...([123n, [1n, [2n]], { amount: 5n, label: 'x' }] as unknown[]),
        ];
        const serialized = getCallClauseQueryKeyWithArgs({
            abi: erc20Abi,
            address: TOKEN,
            method: 'allowance',
            args: withBigInts.slice(3) as never,
        });
        expect(serialized).toEqual([
            'callClause',
            TOKEN,
            'allowance',
            OWNER,
            TOKEN,
            '123',
            ['1', ['2']],
            { amount: '5', label: 'x' },
        ]);
        expect(() => JSON.stringify(serialized)).not.toThrow();
    });
});
