#!/usr/bin/env node
// Builds the E2E (testnet) PR comment from Playwright's JSON report.
// Usage: node scripts/e2e-testnet-comment.mjs <results.json> > comment.md
// Env: RUN_URL, HEAD_SHA, E2E_NODE_URL (defaults to testnet).

import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const MARKER = '<!-- e2e-testnet -->';

export const findSmartAccount = (node) => {
    if (Array.isArray(node)) return node.map(findSmartAccount).find(Boolean);
    if (!node || typeof node !== 'object') return undefined;
    if (node.type === 'smart account' && typeof node.description === 'string')
        return node.description;
    return findSmartAccount(Object.values(node));
};

const formatUnits = (hex) =>
    (Number(BigInt(hex)) / 1e18).toLocaleString('en-US', {
        maximumFractionDigits: 2,
    });

export function formatComment({ stats, smartAccount, account, runUrl, sha }) {
    const title = `**E2E (testnet)**${sha ? ` for ${sha.slice(0, 7)}` : ''}`;
    const lines = [MARKER];
    if (stats) {
        const counts = [
            `${stats.expected} passed`,
            `${stats.unexpected} failed`,
        ];
        if (stats.flaky) counts.push(`${stats.flaky} flaky`);
        if (stats.skipped) counts.push(`${stats.skipped} skipped`);
        const icon = stats.unexpected ? '❌' : '✅';
        lines.push(`${title}: ${icon} ${counts.join(' · ')}`);
    } else {
        lines.push(
            `${title}: ⚠️ no results, the job failed before the tests ran`,
        );
    }
    if (smartAccount && account) {
        lines.push(
            `Smart account \`${smartAccount}\`: ${formatUnits(
                account.balance,
            )} VET · ${formatUnits(account.energy)} VTHO`,
        );
    }
    lines.push(`[Run details](${runUrl})`);
    return `${lines.join('\n')}\n`;
}

const fetchAccount = (nodeUrl, address) =>
    fetch(`${nodeUrl}/accounts/${address}`)
        .then((res) => (res.ok ? res.json() : undefined))
        .catch(() => undefined);

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    const [file] = process.argv.slice(2);
    const report =
        file && existsSync(file)
            ? JSON.parse(readFileSync(file, 'utf8'))
            : null;
    const smartAccount = report ? findSmartAccount(report.suites) : undefined;
    const account = smartAccount
        ? await fetchAccount(
              process.env.E2E_NODE_URL ?? 'https://testnet.vechain.org',
              smartAccount,
          )
        : undefined;
    process.stdout.write(
        formatComment({
            stats: report?.stats,
            smartAccount,
            account,
            runUrl: process.env.RUN_URL,
            sha: process.env.HEAD_SHA,
        }),
    );
}
