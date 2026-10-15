import { describe, expect, it } from 'vitest';
import {
    MARKER,
    findSmartAccount,
    formatComment,
} from './e2e-testnet-comment.mjs';

const runUrl = 'https://github.com/vechain/vechain-kit/actions/runs/1';
const account = {
    balance: '0x' + (2000n * 10n ** 18n).toString(16),
    energy: '0x' + (1234567n * 10n ** 16n).toString(16),
};

describe('e2e-testnet-comment', () => {
    it('reports a green run with balances and the run link', () => {
        expect(
            formatComment({
                stats: { expected: 6, unexpected: 0, flaky: 0, skipped: 0 },
                smartAccount: '0xabc',
                account,
                runUrl,
                sha: '9e8d73e0a57efbce',
            }),
        ).toBe(
            [
                MARKER,
                '**E2E (testnet)** for 9e8d73e: ✅ 6 passed · 0 failed',
                'Smart account `0xabc`: 2,000 VET · 12,345.67 VTHO',
                `[Run details](${runUrl})`,
                '',
            ].join('\n'),
        );
    });

    it('flags failures and lists skipped tests', () => {
        const body = formatComment({
            stats: { expected: 4, unexpected: 1, flaky: 0, skipped: 1 },
            runUrl,
        });
        expect(body).toContain('❌ 4 passed · 1 failed · 1 skipped');
        expect(body).not.toContain('Smart account');
    });

    it('says so when there is no report', () => {
        expect(formatComment({ runUrl })).toContain('⚠️ no results');
    });

    it('finds the smart account annotation anywhere in the report', () => {
        const suites = [
            {
                specs: [
                    {
                        tests: [
                            {
                                annotations: [
                                    { type: 'other', description: 'x' },
                                    {
                                        type: 'smart account',
                                        description: '0xdfaf',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
        expect(findSmartAccount(suites)).toBe('0xdfaf');
        expect(findSmartAccount([{ specs: [] }])).toBeUndefined();
    });
});
