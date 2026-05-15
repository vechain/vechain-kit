#!/usr/bin/env node
/**
 * Pulls every manifest.json under vechain/app-hub@master into a single
 * JSON file at src/app/cross-app/_lib/app-hub.json, keyed by origin so the
 * runtime lookup is O(1) ('https://nubila.ai' -> { name: 'Nubila', ... }).
 *
 * Re-run when the registry adds new apps:
 *
 *   yarn workspace cross-app-connect generate-app-hub
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'vechain/app-hub';
const BRANCH = 'master';
const OUT_PATH = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'src/app/cross-app/_lib/app-hub.json',
);

async function ghFetch(url) {
    const res = await fetch(url, {
        headers: {
            accept: 'application/vnd.github+json',
            // Optional: GITHUB_TOKEN env var raises the rate limit from
            // 60/hr (anonymous) to 5000/hr.
            ...(process.env.GITHUB_TOKEN && {
                authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }),
        },
    });
    if (!res.ok) {
        throw new Error(`${url} -> ${res.status} ${res.statusText}`);
    }
    return res.json();
}

function originOf(href) {
    try {
        return new URL(href).origin;
    } catch {
        return null;
    }
}

const tree = await ghFetch(
    `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
);
const manifestPaths = tree.tree
    .filter((t) => t.path.endsWith('manifest.json'))
    .map((t) => t.path);

console.log(`Found ${manifestPaths.length} manifests`);

const byOrigin = {};
const concurrency = 12;
let completed = 0;
const queue = [...manifestPaths];

async function worker() {
    while (queue.length > 0) {
        const path = queue.shift();
        if (!path) break;
        const slug = path.replace(/^apps\//, '').replace(/\/manifest\.json$/, '');
        try {
            const manifest = await ghFetch(
                `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`,
            );
            const origin = originOf(manifest.href);
            if (!origin) continue;
            // Prefer the first manifest we see for a given origin.
            if (!byOrigin[origin]) {
                byOrigin[origin] = {
                    slug,
                    name: manifest.name,
                    category: manifest.category ?? null,
                    href: manifest.href,
                };
            }
        } catch (e) {
            console.warn(`skip ${path}: ${e.message}`);
        }
        completed++;
        if (completed % 25 === 0) {
            console.log(`  ${completed}/${manifestPaths.length}`);
        }
    }
}

await Promise.all(Array.from({ length: concurrency }, worker));

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(byOrigin, null, 2) + '\n');
console.log(
    `Wrote ${Object.keys(byOrigin).length} entries to ${OUT_PATH}`,
);
