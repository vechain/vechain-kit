import { describe, expect, it } from 'vitest';
import { decodeFunctionData, erc20Abi } from 'viem';
import { buildERC20Clauses } from './useTransferERC20';

const TOKEN = '0x3333333333333333333333333333333333333333';
const RECIPIENT = '0x2222222222222222222222222222222222222222';

describe('buildERC20Clauses', () => {
    it('encodes transfer() with the token decimals, not a fixed 18', () => {
        const [usdc] = buildERC20Clauses(RECIPIENT, '1.5', TOKEN, 'USDC', 6);
        const [vtho] = buildERC20Clauses(RECIPIENT, '1.5', TOKEN, 'VTHO', 18);
        expect(
            decodeFunctionData({
                abi: erc20Abi,
                data: usdc.data as `0x${string}`,
            }),
        ).toEqual({
            functionName: 'transfer',
            args: [RECIPIENT, 1_500_000n],
        });
        expect(
            decodeFunctionData({
                abi: erc20Abi,
                data: vtho.data as `0x${string}`,
            }).args,
        ).toEqual([RECIPIENT, 1_500_000_000_000_000_000n]);
        expect(usdc).toMatchObject({
            to: TOKEN,
            value: '0x0',
            comment: `Transfer 1.5 USDC to ${RECIPIENT}`,
        });
        expect((usdc as { abi?: unknown }).abi).toBeDefined();
    });

    it('rejects a missing amount or an invalid recipient', () => {
        expect(() =>
            buildERC20Clauses(RECIPIENT, '', TOKEN, 'VTHO', 18),
        ).toThrow('Invalid receiver address or amount');
        expect(() =>
            buildERC20Clauses('0x1234', '1', TOKEN, 'VTHO', 18),
        ).toThrow('Invalid receiver address or amount');
    });
});
